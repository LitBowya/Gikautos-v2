import React from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import { useGetUsersQuery } from "../../slices/usersApiSlice";
import { useGetProductsQuery } from "../../slices/productsApiSlice";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import { format } from "date-fns";
import {
  FaUsers,
  FaProductHunt,
  FaClipboardList,
  FaDollarSign,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import OrderListPage from "./OrderListPage";

const AdminDashboard = () => {
  const { pageNumber } = useParams();
  const { data: usersData } = useGetUsersQuery();
  const { data: productsData } = useGetProductsQuery({pageNumber});
  const { data: ordersData } = useGetOrdersQuery();
  const today = format(new Date(), "yyyy-MM-dd");

  const totalUsers = usersData?.length || 0;
  const newUsersToday = usersData?.filter(
    (user) => format(new Date(user.createdAt), "yyyy-MM-dd") === today
  ).length;

const totalProducts =
  productsData && productsData.products ? productsData.products.length : 0;

  const totalOrders = ordersData?.length || 0;
  const newOrdersToday = ordersData?.filter(
    (order) => format(new Date(order.createdAt), "yyyy-MM-dd") === today
  ).length;
  const totalRevenue =
    ordersData?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;

  const ordersByMonth = ordersData?.reduce((acc, order) => {
    const month = format(new Date(order.createdAt), "yyyy-MM");
    if (!acc[month]) acc[month] = 0;
    acc[month]++;
    return acc;
  }, {});

  const ordersChartData = ordersByMonth
    ? Object.keys(ordersByMonth).map((month) => ({
        month,
        orders: Math.max(0, ordersByMonth[month]), // Prevent negative values
      }))
    : [];

  const revenueByMonth = ordersData?.reduce((acc, order) => {
    const month = format(new Date(order.createdAt), "yyyy-MM");
    if (!acc[month]) acc[month] = 0;
    acc[month] += order.totalPrice;
    return acc;
  }, {});

  const revenueChartData = revenueByMonth
    ? Object.keys(revenueByMonth).map((month) => ({
        x: month,
        y: revenueByMonth[month],
      }))
    : [];

  const usersChartData = [
    { id: "new", label: "New Users Today", value: newUsersToday },
    { id: "total", label: "Total Users", value: totalUsers - newUsersToday },
  ];

  const cardStyles = {
    backgroundColor: "#e0f7fa",
    color: "#333",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    },
    height: "100%",
  };

  const iconStyles = {
    fontSize: "3.5rem",
    marginRight: "0.5rem",
    verticalAlign: "middle",
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={3} direction="column">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={cardStyles}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
                      <FaUsers style={{ ...iconStyles, color: "#00796b" }} />
                      Total Users
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: "1.5rem" }}>
                      {totalUsers}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={cardStyles}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
                      <FaUsers style={{ ...iconStyles, color: "#00796b" }} />
                      New Users Today
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: "1.5rem" }}>
                      {newUsersToday}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={cardStyles}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
                      <FaProductHunt
                        style={{ ...iconStyles, color: "#e65100" }}
                      />
                      Total Products
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: "1.5rem" }}>
                      {totalProducts}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={cardStyles}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
                      <FaClipboardList
                        style={{ ...iconStyles, color: "#558b2f" }}
                      />
                      Total Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: "1.5rem" }}>
                      {totalOrders}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={cardStyles}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
                      <FaClipboardList
                        style={{ ...iconStyles, color: "#558b2f" }}
                      />
                      New Orders Today
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: "1.5rem" }}>
                      {newOrdersToday}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={cardStyles}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
                      <FaDollarSign
                        style={{ ...iconStyles, color: "#d84315" }}
                      />
                      Total Revenue
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: "1.5rem" }}>
                      GHS {totalRevenue.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: 400, // Ensure the Card has a fixed height
              ...cardStyles,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden", // Ensure overflow is hidden
            }}
          >
            <CardContent
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontSize: "1.3rem" }}>
                Orders by Month
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                {" "}
                {/* Allow the chart to grow within the Box */}
                {ordersChartData.length > 0 ? (
                  <ResponsiveBar
                    data={ordersChartData}
                    keys={["orders"]}
                    indexBy="month"
                    margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                    padding={0.3}
                    colors={{ scheme: "nivo" }}
                    minValue={0}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Month",
                      legendPosition: "middle",
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Orders",
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                  />
                ) : (
                  <Typography variant="body2">No data available</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: 400,
              ...cardStyles,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <CardContent
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontSize: "1.3rem" }}>
                Revenue by Month
              </Typography>
              <Box sx={{ flexGrow: "1" }}>
                {" "}
                {/* Ensuring the chart fits within its container */}
                {revenueChartData.length > 0 ? (
                  <ResponsiveLine
                    data={[
                      {
                        id: "revenue",
                        data: revenueChartData,
                      },
                    ]}
                    margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                    xScale={{ type: "point" }}
                    yScale={{
                      type: "linear",
                      min: "auto",
                      max: "auto",
                      stacked: true,
                      reverse: false,
                    }}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Month",
                      legendPosition: "middle",
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Revenue",
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                    colors={{ scheme: "nivo" }}
                    pointSize={10}
                    pointColor={{ theme: "background" }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: "serieColor" }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                  />
                ) : (
                  <Typography variant="body2">No data available</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: 400,
              ...cardStyles,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <CardContent
              sx={{ height: "400px", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontSize: "1.3rem" }}>
                Users Statistics
              </Typography>
              <Box sx={{ flexGrow: "1" }}>
                {" "}
                {/* Ensuring the chart fits within its container */}
                {usersChartData.length > 0 ? (
                  <ResponsivePie
                    data={usersChartData}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors={{ scheme: "nivo" }}
                    borderWidth={1}
                    borderColor={{
                      from: "color",
                      modifiers: [["darker", 0.2]],
                    }}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextColor="#333333"
                    radialLabelsLinkColor={{ from: "color" }}
                    sliceLabelsSkipAngle={10}
                    sliceLabelsTextColor="#333333"
                  />
                ) : (
                  <Typography variant="body2">No data available</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <OrderListPage />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
