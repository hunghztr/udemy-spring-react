import { useState } from "react";
import { useGetPaging } from "@/query/use.crud.query";
import { getAllWallets } from "@/query/user/user.query";
import type { IWalletResponse } from "@/type/user.module";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Stack
} from "@mui/material";

export default function AdminWalletPage() {


  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data } = useGetPaging<IWalletResponse, any>(
    "wallets/get-all",
    getAllWallets,
    {
      startDate,
      endDate
    }
  );

  const wallets = data?.elements || [];

  // const handleRowClick = (wallet: IWalletResponse) => {
  //   navigate(`/admin/wallet/${wallet.id}`);
  // };

  return (
    <Box sx={{ p: 4 }}>
      <Typography fontSize={28} fontWeight={700} mb={3}>
        Quản lý doanh thu
      </Typography>

      {/* FILTER */}

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          type="date"
          label="Ngày bắt đầu"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <TextField
          type="date"
          label="Ngày kết thúc"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Fullname</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Số tiền</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {wallets.map((wallet) => (
            <TableRow
              key={wallet.id}
              hover
              // onClick={() => handleRowClick(wallet)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{wallet.id}</TableCell>
              <TableCell>{wallet.fullname}</TableCell>
              <TableCell>{wallet.username}</TableCell>
              <TableCell>${wallet.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}