import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface IProps {
  descriptionDone: boolean;
  contentDone: boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export default function CourseSidebar({
  descriptionDone,
  contentDone,
  activeTab,
  setActiveTab,
}: IProps) {
  return (
    <Box sx={{ width: 260 }}>
      <Typography fontWeight={700} mb={2}>
        Kế hoạch khoá học
      </Typography>

      {/* ===== DESCRIPTION ===== */}
      <List dense>
        <ListItemButton
          selected={activeTab === "description"}
          onClick={() => setActiveTab("description")}
        >
          <ListItemIcon>
            {descriptionDone ? (
              <CheckCircleOutlineIcon color="primary" />
            ) : (
              <RadioButtonUncheckedIcon />
            )}
          </ListItemIcon>

          <ListItemText
            primary="Mô tả"
            primaryTypographyProps={{
              color: descriptionDone ? "primary.main" : "text.secondary",
            }}
          />
        </ListItemButton>
      </List>

      {/* ===== CREATE CONTENT ===== */}
      <Typography fontWeight={700} mt={3} mb={1}>
        Tạo nội dung
      </Typography>

      <List dense>
        <ListItemButton disabled>
          <ListItemIcon>
            <RadioButtonUncheckedIcon />
          </ListItemIcon>
          <ListItemText primary="Film & edit" />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === "content"}
          onClick={() => setActiveTab("content")}
        >
          <ListItemIcon>
            {contentDone ? (
              <CheckCircleOutlineIcon color="primary" />
            ) : (
              <RadioButtonUncheckedIcon />
            )}
          </ListItemIcon>

          <ListItemText
            primary="Nội dung"
            primaryTypographyProps={{
              color: contentDone ? "primary.main" : "text.secondary",
            }}
          />
        </ListItemButton>
      </List>

      {/* ===== PUBLISH ===== */}
      <Typography fontWeight={700} mt={3} mb={1}>
        Công khai khoá học
      </Typography>

      <List dense>
        <ListItemButton disabled>
          <ListItemIcon>
            <RadioButtonUncheckedIcon />
          </ListItemIcon>
          <ListItemText primary="Pricing" />
        </ListItemButton>
      </List>
    </Box>
  );
}
