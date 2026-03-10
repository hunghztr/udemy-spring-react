import { skeletonSx } from "@/helpers/variants";
import {
  Card,
  CardContent,
  Skeleton,
  Stack,
  Box,
} from "@mui/material";



export default function SkeletonLearningCard() {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* IMAGE */}
      <Box sx={{ position: "relative", height: 170 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={skeletonSx}
        />
      </Box>

      {/* CONTENT */}
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Skeleton animation="wave" height={22} width="90%" sx={skeletonSx} />
          <Skeleton animation="wave" height={22} width="75%" sx={skeletonSx} />

          <Skeleton animation="wave" height={16} width="100%" sx={skeletonSx} />
          <Skeleton animation="wave" height={16} width="85%" sx={skeletonSx} />

          <Skeleton animation="wave" height={14} width="40%" sx={skeletonSx} />

          <Stack direction="row" spacing={1}>
            <Skeleton animation="wave" height={18} width={28} sx={skeletonSx} />
            <Skeleton animation="wave" height={14} width={80} sx={skeletonSx} />
            <Skeleton animation="wave" height={14} width={60} sx={skeletonSx} />
            <Skeleton animation="wave" height={14} width={90} sx={skeletonSx} />
          </Stack>

          <Skeleton animation="wave" height={22} width={90} sx={skeletonSx} />
        </Stack>
      </CardContent>
    </Card>
  );
}
