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
  TableBody
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminWalletPage() {

  const navigate = useNavigate();

  const { data } = useGetPaging<IWalletResponse, undefined>(
    "wallets/get-all",
    getAllWallets,
    undefined
  );

  const wallets = data?.elements || [];


  const handleRowClick = (wallet: IWalletResponse) => {
    navigate(`/admin/wallet/${wallet.id}`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography fontSize={28} fontWeight={700} mb={3}>
        Quản lý yêu cầu rút tiền
      </Typography>

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
              onClick={() => handleRowClick(wallet)}
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