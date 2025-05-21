import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Paper, Tooltip, Skeleton, Alert, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

// Enhanced styled components for better UI
const StyledTableContainer = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.grey[100],
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.light,
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '0.9rem',
  fontWeight: 'medium',
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  padding: theme.spacing(1.5),
  fontSize: '0.9rem',
  position: 'sticky',
  top: 0,
  zIndex: 1,
}));

const StyledDayCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  color: theme.palette.common.white,
  fontWeight: 'bold',
  padding: theme.spacing(1.5),
  fontSize: '0.9rem',
  position: 'sticky',
  left: 0,
  zIndex: 2,
}));

const CourseCell = styled(TableCell)(({ theme, type }) => ({
  backgroundColor: type === 0 ? theme.palette.warning.light : theme.palette.info.light,
  cursor: 'pointer',
  transition: 'all 0.2s',
  padding: theme.spacing(1),
  '&:hover': {
    opacity: 0.9,
    transform: 'scale(1.01)',
    boxShadow: theme.shadows[4],
  },
}));

const LevelButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: '20px',
  fontWeight: 'bold',
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
}));

const TooltipContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[6],
  maxWidth: 250,
}));

const TimetableView = ({ data, onMoveCourse, onDeleteCourse }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, content: null, x: 0, y: 0 });
  
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hours = Array.from({ length: 10 }, (_, i) => i + 8);
  
  useEffect(() => {
    // Initialize the selected level when timetable data changes
    if (data && data.levelsTables) {
      const levels = Object.keys(data.levelsTables);
      if (levels.length > 0 && !selectedLevel) {
        setSelectedLevel(levels[0]);
      }
    }
  }, [data, selectedLevel]);
  
  if (!data) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6" color="textSecondary">No timetable data available</Typography>
        <Typography variant="body2" color="textSecondary" mt={1}>Generate or load a timetable to view</Typography>
      </Box>
    );
  }
  
  // Handle the case where we get a different data structure
  // This is to fix the compatibility issue between the old and new data formats
  let processedData = data;
  
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
      processedData = {
        levelsTables: {
          "Level 1": { table }
        }
      };
    } catch (error) {
      console.error("Error processing timetable data:", error);
      return (
        <Box p={3}>
          <Alert severity="error">
            Error processing timetable data. The data format may be incompatible.
          </Alert>
        </Box>
      );
    }
  }
  
  const levels = Object.keys(processedData.levelsTables);
  
  const handleCellClick = (interval, day) => {
    if (interval && onMoveCourse) {
      onMoveCourse({ interval, day });
    }
  };
  
  const handleCellRightClick = (e, interval, day) => {
    e.preventDefault();
    if (interval && onDeleteCourse) {
      onDeleteCourse({ interval, day });
    }
  };
  
  const handleMouseOver = (e, courseData) => {
    if (courseData) {
      setTooltip({
        show: true,
        content: courseData,
        x: e.clientX,
        y: e.clientY
      });
    }
  };
  
  const handleMouseOut = () => {
    setTooltip({ show: false, content: null, x: 0, y: 0 });
  };
  
  const renderTooltip = () => {
    if (!tooltip.show || !tooltip.content) return null;
    
    const { courseCode, teachingAssistant, teachingPlace, courseType } = tooltip.content.info;
    
    return (
      <TooltipContent
        sx={{
          position: 'fixed',
          top: tooltip.y + 15,
          left: tooltip.x + 15,
          zIndex: 10000,
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" mb={0.5}>{courseCode}</Typography>
        <Typography variant="body2"><strong>Teacher:</strong> {teachingAssistant}</Typography>
        <Typography variant="body2"><strong>Place:</strong> {teachingPlace}</Typography>
        <Typography variant="body2">
          <Chip 
            size="small" 
            color={courseType === 0 ? "warning" : "info"} 
            label={courseType === 0 ? 'Theory' : 'Lab'} 
            sx={{ mt: 0.5 }}
          />
        </Typography>
      </TooltipContent>
    );
  };
  
  const renderTable = () => {
    if (!selectedLevel || !processedData.levelsTables[selectedLevel]) {
      return (
        <Skeleton variant="rectangular" height={400} animation="wave" />
      );
    }
    
    const tableData = processedData.levelsTables[selectedLevel].table;
    
    return (
      <Table sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: '0' }}>
        <TableHead>
          <TableRow>
            <StyledHeaderCell align="center">Day / Time</StyledHeaderCell>
            {hours.map(h => (
              <StyledHeaderCell key={h} align="center">{h}:00 - {h+1}:00</StyledHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {days.map((day, rowIndex) => (
            <TableRow key={day} sx={{ 
              backgroundColor: rowIndex % 2 === 0 ? 'white' : '#f9f9f9',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}>
              <StyledDayCell align="center">{day}</StyledDayCell>
              
              {hours.map(hour => {
                const intervals = tableData[day] || [];
                const interval = intervals.find(i => hour >= i.startFrom && hour < i.endTo);
                
                if (interval) {
                  const isLecture = interval.info.courseType === 0;
                  const colspan = interval.endTo - interval.startFrom;
                  
                  // Skip cells that are part of a multi-hour course
                  if (hour > interval.startFrom && hour < interval.endTo) {
                    return null;
                  }
                  
                  return (
                    <CourseCell 
                      key={hour}
                      colSpan={colspan}
                      type={interval.info.courseType}
                      onClick={() => handleCellClick(interval, day)}
                      onContextMenu={(e) => handleCellRightClick(e, interval, day)}
                      onMouseOver={(e) => handleMouseOver(e, interval)}
                      onMouseOut={handleMouseOut}
                      align="center"
                    >
                      <Box py={0.5}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {interval.info.courseCode}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ opacity: 0.9 }}>
                          {interval.info.teachingAssistant}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ opacity: 0.9 }}>
                          {interval.info.teachingPlace}
                        </Typography>
                        <Chip 
                          size="small" 
                          variant="outlined"
                          label={isLecture ? 'Theory' : 'Lab'} 
                          color={isLecture ? "warning" : "info"} 
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </CourseCell>
                  );
                }
                
                return <StyledTableCell key={hour} />;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  return (
    <Box>
      <Box display="flex" flexWrap="wrap" mb={2} gap={1}>
        {levels.map(level => (
          <LevelButton
            key={level}
            variant={selectedLevel === level ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setSelectedLevel(level)}
            size="small"
          >
            {level}
          </LevelButton>
        ))}
      </Box>
      
      <Paper elevation={2} sx={{ mb: 2, p: 0.5 }}>
        <StyledTableContainer>
          {renderTable()}
        </StyledTableContainer>
      </Paper>
      
      <Box mt={2} px={1}>
        <Typography variant="caption" color="text.secondary">
          Tip: Click on a course to move it, right-click to delete
        </Typography>
      </Box>
      
      {tooltip.show && renderTooltip()}
    </Box>
  );
};

export default TimetableView; 