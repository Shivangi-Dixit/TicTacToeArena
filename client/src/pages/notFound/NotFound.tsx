import { Button, Card, CardContent, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import { useNavigate } from "react-router-dom";
import { styles } from "./NotFound.styles";
import { NOT_FOUND_MODULE_TEXT } from "./NotFound.texts";

export default function NotFound() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={styles.root}>
      <Card sx={styles.card}>
        <CardContent>
          <Box sx={styles.contentBox}>
            <PriorityHighRoundedIcon sx={styles.icon} />
            <Typography sx={styles.title}>{NOT_FOUND_MODULE_TEXT.TITLE}</Typography>
            <Typography sx={styles.message}>{NOT_FOUND_MODULE_TEXT.MESSAGE}</Typography>
            <Button variant="contained" color="primary" sx={styles.button} onClick={() => navigate("/")}>{NOT_FOUND_MODULE_TEXT.BUTTON_LABEL}</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
