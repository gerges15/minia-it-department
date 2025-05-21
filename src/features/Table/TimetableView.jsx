import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Typography, 
  Button, 
  Paper, 
  Tooltip, 
  Skeleton, 
  Alert, 
  Chip,
  Stack,
  IconButton,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RoomIcon from '@mui/icons-material/Room';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScienceIcon from '@mui/icons-material/Science';
import './TimetableStyles.css';

// Enhanced styled components for better UI
const StyledTableContainer = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'var(--shadow)',
  '&::-webkit-scrollbar': {
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'var(--gray-100)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'var(--primary-light)',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: 'var(--primary)',
    },
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  borderCollapse: 'separate',
  borderSpacing: '1px',
  background: 'var(--gray-100)',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '0.9rem',
  fontWeight: 'medium',
  borderRadius: 'var(--border-radius-sm)',
  transition: 'all var(--transition-normal)',
  background: 'white',
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'var(--primary)',
  color: theme.palette.common.white,
  fontWeight: 'bold',
  padding: theme.spacing(1.5),
  fontSize: '0.9rem',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  borderRadius: 'var(--border-radius-sm)',
}));

const StyledDayCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'var(--gray-800)',
  color: theme.palette.common.white,
  fontWeight: 'bold',
  padding: theme.spacing(1.5),
  fontSize: '0.9rem',
  position: 'sticky',
  left: 0,
  zIndex: 2,
  borderRadius: 'var(--border-radius-sm)',
}));

const CourseCell = styled(TableCell)(({ theme, type, span = 1 }) => ({
  backgroundColor: type === 0 ? 'var(--warning-light)' : 'var(--info-light)',
  cursor: 'pointer',
  transition: 'all var(--transition-normal)',
  padding: theme.spacing(1),
  borderRadius: 'var(--border-radius-sm)',
  borderLeft: `4px solid ${type === 0 ? 'var(--warning)' : 'var(--info)'}`,
  boxShadow: 'var(--shadow-sm)',
  position: 'relative',
  '&:hover': {
    opacity: 0.95,
    transform: 'translateY(-2px) scale(1.01)',
    boxShadow: 'var(--shadow-md)',
    zIndex: 5,
  },
  ...(span > 1 && {
    gridColumn: `span ${span}`,
  }),
}));

const LevelButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: 'var(--border-radius-full)',
  fontWeight: 'bold',
  textTransform: 'none',
  transition: 'all var(--transition-normal)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-md)',
  },
}));

const EmptyCell = styled(TableCell)(({ theme }) => ({
  background: 'white',
  border: '1px dashed var(--gray-200)',
  borderRadius: 'var(--border-radius-sm)',
  color: 'var(--gray-400)',
  fontStyle: 'italic',
  textAlign: 'center',
  transition: 'all var(--transition-normal)',
  '&:hover': {
    backgroundColor: 'var(--gray-50)',
  },
}));

const TooltipContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: 'var(--border-radius)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'var(--shadow-lg)',
  maxWidth: 300,
  animation: 'tooltipFadeIn 0.2s ease',
}));

const TimetableComponent = ({ data, onMoveCourse, onDeleteCourse }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, content: null, x: 0, y: 0 });
  
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hours = Array.from({ length: 10 }, (_, i) => i + 8);
  
  // Use useMemo to process the data only when it changes
  const processedData = useMemo(() => {
    if (!data) return null;
    
    // Check if data has levelsTables property (expected structure)
    if (!data.levelsTables) {
      // Try to convert from the alternative structure
      try {
        const table = {};
        if (data.table) {
          // Directly use the table if it's in the right format
          Object.keys(data.table).forEach(day => {
            if (Array.isArray(data.table[day])) {
              table[day] = data.table[day].map(slot => {
                // Transform to the expected interval format if needed
                return {
                  startFrom: slot.startFrom,
                  endTo: slot.endTo,
                  info: {
                    courseCode: slot.courseCode || '',
                    teachingAssistant: slot.teachingAssistant || '',
                    teachingPlace: slot.teachingPlace || '',
                    courseType: slot.courseType !== undefined ? slot.courseType : (slot.courseCode?.includes('Lab') ? 1 : 0)
                  }
                };
              });
            }
          });
        }
        
        // Create a synthetic levelsTables structure
        return {
          levelsTables: {
            "Level 1": { table }
          }
        };
      } catch (error) {
        console.error("Error processing timetable data:", error);
        return null;
      }
    }
    
    return data;
  }, [data]);
  
  // Initialize the selected level when timetable data changes
  useEffect(() => {
    if (processedData && processedData.levelsTables) {
      const levels = Object.keys(processedData.levelsTables);
      if (levels.length > 0 && !selectedLevel) {
        setSelectedLevel(levels[0]);
      }
    }
  }, [processedData, selectedLevel]);
  
  // Handle cell interactions
  const handleCellClick = useCallback((interval, day) => {
    if (interval && onMoveCourse) {
      onMoveCourse({ interval, day });
    }
  }, [onMoveCourse]);
  
  const handleCellRightClick = useCallback((e, interval, day) => {
    e.preventDefault();
    if (interval && onDeleteCourse) {
      onDeleteCourse({ interval, day });
    }
  }, [onDeleteCourse]);
  
  const handleMouseOver = useCallback((e, courseData) => {
    if (courseData) {
      setTooltip({
        show: true,
        content: courseData,
        x: e.clientX,
        y: e.clientY
      });
    }
  }, []);
  
  const handleMouseOut = useCallback(() => {
    setTooltip({ show: false, content: null, x: 0, y: 0 });
  }, []);
  
  // No data state
  if (!processedData) {
    return (
      <Paper elevation={0} sx={{ 
        p: 4, 
        textAlign: 'center',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow)',
        backgroundColor: 'var(--gray-50)'
      }}>
        <Stack spacing={2} alignItems="center">
          <ScheduleIcon sx={{ fontSize: 48, color: 'var(--gray-400)' }} />
          <Typography variant="h6" color="textSecondary">No timetable data available</Typography>
          <Typography variant="body2" color="textSecondary">
            Generate or load a timetable to view
          </Typography>
        </Stack>
      </Paper>
    );
  }
  
  // Extract the levels from the data
  const levels = Object.keys(processedData.levelsTables);
  
  // Level selection buttons
  const renderLevelButtons = () => (
    <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap' }}>
      {levels.map((level) => (
        <LevelButton
          key={level}
          variant={selectedLevel === level ? "contained" : "outlined"}
          color="primary"
          onClick={() => setSelectedLevel(level)}
          size={isMobile ? "small" : "medium"}
        >
          {level}
        </LevelButton>
      ))}
    </Box>
  );
  
  // Course tooltip content
  const renderTooltip = () => {
    if (!tooltip.show || !tooltip.content) return null;
    
    const { courseCode, teachingAssistant, teachingPlace, courseType } = tooltip.content.info;
    
    return (
      <Zoom in={tooltip.show}>
        <TooltipContent
        sx={{
          position: 'fixed',
          top: tooltip.y + 15,
          left: tooltip.x + 15,
          zIndex: 10000,
        }}
      >
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {courseType === 0 ? (
                <MenuBookIcon color="warning" fontSize="small" />
              ) : (
                <ScienceIcon color="info" fontSize="small" />
              )}
              <Typography variant="subtitle1" fontWeight="bold">{courseCode}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="body2">{teachingAssistant || 'Not assigned'}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RoomIcon fontSize="small" color="action" />
              <Typography variant="body2">{teachingPlace || 'No location'}</Typography>
      </Box>
            
            <Chip 
              size="small" 
              color={courseType === 0 ? "warning" : "info"} 
              label={courseType === 0 ? 'Theory' : 'Lab'} 
              variant="outlined"
            />
          </Stack>
        </TooltipContent>
      </Zoom>
    );
  };
  
  // Render the timetable
  const renderTable = () => {
    if (!selectedLevel || !processedData.levelsTables[selectedLevel]) {
      return (
        <Box sx={{ p: 2 }}>
          <Skeleton variant="rectangular" height={400} animation="wave" />
        </Box>
      );
    }
    
    const tableData = processedData.levelsTables[selectedLevel].table;
    
    return (
      <StyledTableContainer>
        <StyledTable>
        <TableHead>
          <TableRow>
              <StyledHeaderCell align="center">Day / Time</StyledHeaderCell>
            {hours.map(h => (
                <StyledHeaderCell key={h} align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <ScheduleIcon fontSize="small" />
                    {h}:00 - {h+1}:00
                  </Box>
                </StyledHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {days.map((day, rowIndex) => (
              <TableRow key={day} sx={{ 
                '&:hover': { '& .MuiTableCell-root:not(.header-cell)': { backgroundColor: 'var(--gray-50)' } }
              }}>
                <StyledDayCell align="center" className="header-cell">
                  {day}
                </StyledDayCell>
                
              {hours.map(hour => {
                  const intervals = tableData[day] || [];
                const interval = intervals.find(i => hour >= i.startFrom && hour < i.endTo);
                
                if (interval) {
                    // Only render the cell if this is the start hour of an interval
                    if (hour === interval.startFrom) {
                  const isLecture = interval.info.courseType === 0;
                  const colspan = interval.endTo - interval.startFrom;
                  
                      return (
                        <CourseCell
                          key={`${day}-${hour}`}
                          align="center"
                          colSpan={colspan}
                          type={isLecture ? 0 : 1}
                          onClick={() => handleCellClick(interval, day)}
                          onContextMenu={(e) => handleCellRightClick(e, interval, day)}
                          onMouseOver={(e) => handleMouseOver(e, interval)}
                          onMouseOut={handleMouseOut}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: 1,
                            alignItems: 'center'
                          }}>
                            <Chip
                              label={interval.info.courseCode}
                              color={isLecture ? "warning" : "info"}
                              size="small"
                              variant="filled"
                              sx={{ fontWeight: 'bold' }}
                            />
                            
                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                              <PersonIcon fontSize="small" color="action" />
                              <Typography variant="caption" noWrap>
                                {interval.info.teachingAssistant || 'Not assigned'}
                              </Typography>
                            </Stack>
                            
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <RoomIcon fontSize="small" color="action" />
                              <Typography variant="caption" noWrap>
                                {interval.info.teachingPlace || 'No location'}
                              </Typography>
                            </Stack>
                            
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCellRightClick(e, interval, day);
                              }}
                              sx={{ 
                                position: 'absolute', 
                                top: 5, 
                                right: 5,
                                opacity: 0.6,
                                '&:hover': { opacity: 1 }
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </CourseCell>
                      );
                    }
                    // Skip rendering cells that are covered by a multi-hour interval
                    return null;
                  }
                  
                  return (
                    <EmptyCell key={`${day}-${hour}`} align="center">
                      Free
                    </EmptyCell>
                  );
              })}
            </TableRow>
          ))}
        </TableBody>
        </StyledTable>
      </StyledTableContainer>
    );
  };
  
  return (
    <Fade in={true} timeout={500}>
    <Box>
        {renderLevelButtons()}
        {renderTable()}
        {renderTooltip()}
      </Box>
    </Fade>
  );
};

export default TimetableComponent; 