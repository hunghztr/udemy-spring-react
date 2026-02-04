import PassedCourse from "@/components/admin/course/passed.course";
import { createNotification } from "@/query/notification/notification.query";
import { useSave } from "@/query/use.crud.query";
import { useAppSelector } from "@/redux/hook";
import type { ICourseDetailResponse } from "@/type/course.module";
import type { INotification } from "@/type/notification.module";
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface IProps {
  activeTab: "description" | "content" | "image" | "pricing";
  setActiveTab: (value: IProps["activeTab"]) => void;
  course:ICourseDetailResponse|null;
  refetch: () => Promise<any>;
}

const tabs = [
  { key: "description", label: "Mô tả" },
  { key: "content", label: "Nội dung" },
  { key: "image", label: "Hình ảnh" },
  { key: "pricing", label: "Giá tiền" },
] as const;

export default function CourseSidebar({ activeTab, setActiveTab,course,refetch }: IProps) {
  const {mutate} = useSave<boolean,INotification>('notifications/create',createNotification);
  const {roleName,username} = useAppSelector(state => state.currentUser);
    const navigate = useNavigate();
    
    const handleSendNotify = (request : INotification) =>{
      mutate(request)
    }
  return (
    <Box sx={{ width: 240 }}>
      <Typography fontWeight={700} mb={2}>
        Kế hoạch khoá học
      </Typography>

      <List disablePadding>
        {tabs.map((t) => {
          const isActive = activeTab === t.key;

          return (
            <ListItemButton
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              sx={{
                mb: 0.5,
                borderRadius: 1.5,
                pl: 2,
                position: "relative",
                bgcolor: isActive ? "grey.100" : "transparent",
                "&:hover": {
                  bgcolor: "grey.100",
                },
                "&::before": isActive
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 6,
                      bottom: 6,
                      width: 4,
                      borderRadius: 2,
                      bgcolor: "primary.main",
                    }
                  : {},
              }}
            >
              <ListItemText
                primary={t.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "text.primary" : "text.secondary",
                }}
              />
              
            </ListItemButton>
          );
        })}
        {roleName !== "ADMIN" && (
          <Box mt={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() =>{
                const request = {
                  title:"Phê duyệt khoá học",
                  message:`${username} đã chỉnh sửa khoá học, vui lòng phê duyệt khoá học`,
                  url: `/instructor/edit-course/${course?.id||""}`,
                  user:{
                    username:"admin@gmail.com"
                  }
                }
                handleSendNotify(request);
                 navigate(-1)
                }
              }
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Lưu toàn bộ
            </Button>
          </Box>
        )}

        {roleName === "ADMIN" && course && (
              <PassedCourse course={course} refetch={refetch} handleSendNotify={handleSendNotify} />
          )}
      </List>
    </Box>
  );
}
