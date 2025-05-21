import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Paper, Tooltip } from '@mui/material';

const TimetableView = ({ timetableData, onMoveCourse, onMoveSubmit, onDeleteCourse }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, content: null, x: 0, y: 0 });
  
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hours = Array.from({ length: 10 }, (_, i) => i + 8);
  
  useEffect(() => {
    // Initialize the selected level when timetable data changes
    if (timetableData && timetableData.levelsTables) {
      const levels = Object.keys(timetableData.levelsTables);
      if (levels.length > 0 && !selectedLevel) {
        setSelectedLevel(levels[0]);
      }
    }
  }, [timetableData, selectedLevel]);
  
  if (!timetableData || !timetableData.levelsTables) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6" color="textSecondary">No timetable data available</Typography>
        <Typography variant="body2" color="textSecondary">Generate or load a timetable to view</Typography>
      </Box>
    );
  }
  
  const levels = Object.keys(timetableData.levelsTables);
  
  const handleCellClick = (interval, day) => {
    if (interval) {
      onMoveCourse({ interval, day });
    }
  };
  
  const handleCellRightClick = (e, interval, day) => {
    e.preventDefault();
    if (interval) {
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
      <Box
        sx={{
          position: 'fixed',
          top: tooltip.y + 15,
          left: tooltip.x + 15,
          bgcolor: 'background.paper',
          p: 2,
          boxShadow: 3,
          borderRadius: 1,
          zIndex: 10000,
        }}
      >
        <Typography><strong>Course:</strong> {courseCode}</Typography>
        <Typography><strong>Teacher:</strong> {teachingAssistant}</Typography>
        <Typography><strong>Place:</strong> {teachingPlace}</Typography>
        <Typography><strong>Type:</strong> {courseType === 0 ? 'Lecture' : 'Practical'}</Typography>
      </Box>
    );
  };
  
  const renderTable = () => {
    if (!selectedLevel) return null;
    
    const data = timetableData.levelsTables[selectedLevel].table;
    
    return (
      <Table sx={{ 
        minWidth: 650,
        borderCollapse: 'separate',
        borderSpacing: '0 4px',
        '& th': {
          fontWeight: 'bold',
          backgroundColor: '#f5f5f5',
          position: 'sticky',
          top: 0,
          zIndex: 1
        },
        '& th:first-of-type': {
          position: 'sticky',
          left: 0,
          zIndex: 2
        },
        '& td:first-of-type': {
          position: 'sticky',
          left: 0,
          backgroundColor: 'white',
          fontWeight: 'bold',
          zIndex: 1
        }
      }}>
        <TableHead>
          <TableRow>
            <TableCell>Day / Time</TableCell>
            {hours.map(h => (
              <TableCell key={h} align="center">{h}:00 - {h+1}:00</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {days.map((day, rowIndex) => (
            <TableRow key={day} sx={{ backgroundColor: rowIndex % 2 === 0 ? 'white' : '#f9f9f9' }}>
              <TableCell>{day}</TableCell>
              {hours.map(hour => {
                const intervals = data[day] || [];
                const interval = intervals.find(i => hour >= i.startFrom && hour < i.endTo);
                
                if (interval) {
                  const isLecture = interval.info.courseType === 0;
                  const colspan = interval.endTo - interval.startFrom;
                  
                  // Skip cells that are part of a multi-hour course
                  if (hour > interval.startFrom && hour < interval.endTo) {
                    return null;
                  }
                  
                  return (
                    <TableCell 
                      key={hour}
                      colSpan={colspan}
                      onClick={() => handleCellClick(interval, day)}
                      onContextMenu={(e) => handleCellRightClick(e, interval, day)}
                      onMouseOver={(e) => handleMouseOver(e, interval)}
                      onMouseOut={handleMouseOut}
                      sx={{
                        backgroundColor: isLecture ? '#fff176' : '#81d4fa',
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.9,
                          transform: 'scale(1.01)',
                          transition: 'all 0.2s'
                        }
                      }}
                    >
                      <Box textAlign="center">
                        <Typography variant="body2" fontWeight="bold">
                          {interval.info.courseCode}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {interval.info.teachingAssistant}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {interval.info.teachingPlace}
                        </Typography>
                        <Typography variant="caption" color={isLecture ? 'primary' : 'secondary'} fontWeight="medium">
                          {isLecture ? 'Lecture' : 'Practical'}
                        </Typography>
                      </Box>
                    </TableCell>
                  );
                }
                
                return <TableCell key={hour} />;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  return (
    <Box>
      <Box display="flex" mb={2} gap={1}>
        {levels.map(level => (
          <Button
            key={level}
            variant={selectedLevel === level ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setSelectedLevel(level)}
            sx={{ minWidth: 120 }}
          >
            {level}
          </Button>
        ))}
      </Box>
      
      <Box sx={{ overflowX: 'auto' }}>
        {renderTable()}
      </Box>
      
      {tooltip.show && renderTooltip()}
    </Box>
  );
};

export default TimetableView; 