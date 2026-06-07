import {
  Box,
  Typography,
  Stack,
  Avatar,
  Paper,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import GroupsIcon from "@mui/icons-material/Groups";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ReviewsIcon from "@mui/icons-material/Reviews";

import type {
  IUserDetailResponse,
  IUserResponse,
} from "@/type/user.module";

import { useGetById } from "@/query/use.crud.query";
import { getProfile } from "@/query/user/user.query";

export default function Instructor({
  author,
}: {
  author: IUserResponse;
}) {

  const { data: profileData } =
    useGetById<IUserDetailResponse>(
      "profiles/get-by-id",
      getProfile,
      author.id || ""
    );
  const avatar =
    `${import.meta.env.VITE_CLOUDINARY_WATCH_IMG}/${profileData?.avatarPath}`;
    console.log(profileData)
  return (
    <Paper
      sx={(theme) => ({
        mt: 6,
        p: 4,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
      })}
    >
      {/* TITLE */}
      <Typography variant="h5" fontWeight={700} mb={2}>
        Instructor
      </Typography>

      {/* NAME */}
      <Typography
        variant="h6"
        sx={(theme) => ({
            color: theme.palette.primary.main,
            cursor: "pointer",
            fontWeight: 600,
        })}
        >
        {profileData?.fullname || author.fullname}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        {profileData?.roleName || author.roleName}
      </Typography>

      {/* INFO */}
      <Stack direction="row" spacing={3}>
        {/* AVATAR */}
        <Avatar
          src={avatar}
          sx={{
            width: 110,
            height: 110,
          }}
        />

        {/* STATS (temporary demo data) */}
        <Stack spacing={1.2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <StarIcon fontSize="small" />
            <Typography variant="body2">
              4.7 Instructor Rating
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <ReviewsIcon fontSize="small" />
            <Typography variant="body2">
              1,043,227 Reviews
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <GroupsIcon fontSize="small" />
            <Typography variant="body2">
              3,399,739 Students
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <PlayCircleIcon fontSize="small" />
            <Typography variant="body2">
              8 Courses
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* DESCRIPTION */}
      <Box mt={3}>
        <Typography
            variant="body2"
            color="text.secondary"
            sx={{
            "& p": { mb: 1.5 },
            "& ul": { pl: 3 },
            "& li": { mb: 0.5 },
            "& strong": { fontWeight: 600 },
            }}
            dangerouslySetInnerHTML={{
            __html:
                profileData?.description ||
                `<p>I'm ${author.fullname}, a developer with a passion for teaching.</p>`,
            }}
        />
        </Box>
    </Paper>
  );
}