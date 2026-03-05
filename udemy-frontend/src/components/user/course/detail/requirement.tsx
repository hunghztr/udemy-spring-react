import { Paper, Typography, Stack } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

export default function Requirement({ items }: { items: string[] }) {
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
        Yêu cầu
      </Typography>

      {items.length > 0 ? (
        <Stack spacing={1.5}>
          {items.map((item, idx) => (
            <Stack
              key={idx}
              direction="row"
              spacing={1.5}
              sx={(theme) => ({
                alignItems: "center",
                p: 1,
                borderRadius: 2,
                transition: "all .2s",
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              })}
            >
              <CircleIcon
                sx={(theme) => ({
                  fontSize: 8,
                  mt: "7px",
                  color: theme.palette.primary.main,
                })}
              />

              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                {item}
              </Typography>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          Chưa có yêu cầu.
        </Typography>
      )}
    </Paper>
  );
}