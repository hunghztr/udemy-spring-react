import { Grid, Paper, Stack, Typography } from '@mui/material'
import CheckIcon from "@mui/icons-material/Check";


export default function WhatLearn({objectives}: {objectives: string[]}) {
  return (
    <Paper
      sx={(theme) => ({
        p: 4,
        mb: 6,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
      })}
    >
      <Typography variant="h5" fontWeight={700} mb={3}>
        Bạn sẽ học được gì
      </Typography>

      {objectives.length > 0 ? (
        <Grid container spacing={2}>
          {objectives.map((item, idx) => (
            <Grid key={idx} sx={{ xs: "12", md: "6" }}>
              <Stack
                direction="row"
                spacing={1.5}
                sx={(theme) => ({
                  p: 1,
                  borderRadius: 2,
                  transition: "all .2s",
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  },
                })}
              >
                <CheckIcon
                  sx={(theme) => ({
                    fontSize: 20,
                    color: theme.palette.primary.main,
                    mt: "2px",
                  })}
                />

                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.6 }}
                >
                  {item}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          Chưa có mục tiêu học tập.
        </Typography>
      )}
    </Paper>
  )
}
