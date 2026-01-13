
export default function CategoryManagementPage() {
 



  return (
    <></>
    // <Box>
    //   {/* ===== Header ===== */}
    //   <UserHeader active={active} handleToggle={handleToggle} setOpenCreate={setOpenCreate}
    //   keyword={keyword} setKeyword={setKey} />

    //   {/* ===== Table ===== */}
    //   <Paper sx={{ p: 2, minHeight: 240 }}>
    //     {/* ⏳ Loading */}
    //     {loading.pendingCount > 0 && (
    //       <Stack alignItems="center" py={4}>
    //         <Loading />
    //       </Stack>
    //     )}

    //     {/* ❌ Error */}
    //     {loading.pendingCount === 0 && error && (
    //       <Alert severity="error">{error}</Alert>
    //     )}

    //     {/* ✅ Data */}
    //     {loading.pendingCount === 0 &&
    //       !error &&
    //       data &&
    //       data.length > 0 && (
    //         <>
    //           <TableContainer
    //             component={Paper}
    //             sx={{
    //               borderRadius: 2,
    //               boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    //             }}
    //           >
    //             <Table>
    //               <TableHead>
    //                 <TableRow sx={{ backgroundColor: "#fafafa" }}>
    //                   <TableCell sx={{ fontWeight: 700 }}>Mã</TableCell>
    //                   <TableCell sx={{ fontWeight: 700 }}>
    //                     Tên
    //                   </TableCell>
    //                   <TableCell sx={{ fontWeight: 700 }}>Danh mục cha</TableCell>
    //                   <TableCell align="center" sx={{ fontWeight: 700 }}>
    //                     Hành vi
    //                   </TableCell>
    //                 </TableRow>
    //               </TableHead>

    //               <TableBody>
    //                 {data.map((category) => (
    //                   <TableRow
    //                     key={category.id}
    //                     hover
    //                     sx={{
    //                       cursor: "pointer",
    //                       transition: "0.2s",
    //                       "&:hover": {
    //                         backgroundColor: "rgba(25,118,210,0.06)",
    //                       },
    //                     }}
    //                   >
    //                     {/* ID rút gọn */}
    //                     <TableCell>
    //                       <Tooltip title={category.id}>
    //                         <Typography fontFamily="monospace">
    //                           {category.id.slice(0, 8)}...
    //                         </Typography>
    //                       </Tooltip>
    //                     </TableCell>

    //                     <TableCell>{category.name}</TableCell>
    //                     <TableCell>{category.categoryParent?.name}</TableCell>
    //                     {/* Action */}
    //                     <TableCell align="center">
    //                       <Stack
    //                         direction="row"
    //                         spacing={1}
    //                         justifyContent="center"
    //                       >
    //                         {/* ✏️ Edit */}
    //                         <Tooltip title="Sửa thông tin">
    //                           <IconButton
    //                             size="small"
    //                             color="primary"
    //                             onClick={() => {
    //                               setSelectedUserId(category.id);
    //                               setOpenUpdate(true);
    //                             }}
    //                           >
    //                             <EditIcon />
    //                           </IconButton>
    //                         </Tooltip>

    //                         {/* 🚫 Disable khi đang Active */}
    //                         {active && (
    //                           <Tooltip title="Ngừng hoạt động">
    //                             <IconButton
    //                               size="small"
    //                               color="warning"
    //                               // disabled={category.roleName === "ADMIN"}
    //                               onClick={() => handleDisableUser(category.id)}
    //                             >
    //                               <BlockIcon />
    //                             </IconButton>
    //                           </Tooltip>
    //                         )}

    //                         {/* ✅ Enable khi đang Inactive */}
    //                         {!active && (
    //                           <Tooltip title="Kích hoạt lại">
    //                             <IconButton
    //                               size="small"
    //                               color="success"
    //                               onClick={() => handleEnableUser(category.id)}
    //                             >
    //                               <CheckCircleIcon />
    //                             </IconButton>
    //                           </Tooltip>
    //                         )}

    //                       </Stack>
    //                     </TableCell>
    //                   </TableRow>
    //                 ))}
    //               </TableBody>
    //             </Table>
    //           </TableContainer>

    //           <PaginationComponent
    //             meta={meta}
    //             page={page}
    //             setPage={setPage}
    //             pendingCount={loading.pendingCount}
    //           />
    //         </>
    //       )}
    //   </Paper>
    //   {/* ===== Dialogs ===== */}
    //   <UserCreateDialog
    //     setRefreshFlag={setRefreshFlag}
    //     open={openCreate}
    //     onClose={() => setOpenCreate(false)}
    //   />
    //   <UserUpdateDialog
    //     setRefreshFlag={setRefreshFlag}
    //     open={openUpdate}
    //     onClose={() => setOpenUpdate(false)}
    //     userId={selectedUserId}
    //     setUserId={setSelectedUserId}
    //   />
    // </Box>
  );
}
