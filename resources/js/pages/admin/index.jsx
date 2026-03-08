import React, { useEffect, useState } from "react"

import MyLink from "@/components/Core/MyLink"
import Img from "@/components/Core/Img"

import Bar from "@/components/Charts/Bar"
import Doughnut from "@/components/Charts/Doughnut"
import Pie from "@/components/Charts/Pie"
import ChartBox from "@/components/Core/ChartBox"

import ProjectSVG from "@/svgs/ProjectSVG"
import MoneySVG from "@/svgs/MoneySVG"
import ProductSVG from "@/svgs/ProductSVG"
import PeopleSVG from "@/svgs/PeopleSVG"
import { Link } from "react-router-dom/cjs/react-router-dom.min"

const index = (props) => {
	const [propertyId, setPropertyId] = useState(
		props.auth.propertyIds?.length ? props.auth.propertyIds : [0]
	)

	const [dashboard, setDashboard] = useState(props.getLocalStorage("dashboard"))
	const [dashboardProperties, setDashboardProperties] = useState(
		props.getLocalStorage("dashboardProperties")
	)
	const [staff, setStaff] = useState([])
	const [payments, setPayments] = useState([])

	useEffect(() => {
		// Set page
		props.setPage({ name: "Dashboard", path: ["/dashboard"] })

		// Fetch Dashboard
		Axios.get(`api/dashboard/1,2,3,4,5`)
			.then((res) => {
				// Reset Data
				setDashboard([])

				setDashboard(res.data.data)
				props.setLocalStorage("dashboard", res.data.data)
			})
			.catch(() => props.setErrors(["Failed to fetch Dashboard"]))
	}, [])

	/*
	 * Graph Data
	 */

	var lineGraphLeads = [
		{
			label: "Last Week",
			data: [10, 30, 40, 50, 10, 40, 30],
			backgroundColor: "rgba(54, 162, 235, 1)",
			borderColor: "rgba(54, 162, 235, 1)",
			// borderWidth: 1,
		},
	]

	var lineGraphRevenue = [
		{
			label: "Last Week",
			data: [30, 20, 40, 40, 40, 20, 30],
			backgroundColor: "rgba(40, 167, 69, 1)",
			borderColor: "rgba(40, 167, 69, 1)",
			// borderWidth: 1,
		},
	]

	var lineGraphProjects = [
		{
			label: "Last Week",
			data: [10, 20, 30, 40, 10, 20, 30],
			backgroundColor: "rgba(153, 102, 255, 1)",
			borderColor: "rgba(153, 102, 255, 1)",
			// borderWidth: 1,
		},
	]

	var lineGraphTasks = [
		{
			label: "Last Week",
			data: [40, 40, 30, 40, 40, 20, 40],
			backgroundColor: "rgba(220, 53, 69, 1)",
			borderColor: "rgba(220, 53, 69, 1)",
			// borderWidth: 1,
		},
	]

	var barGraphLeads = [
		{
			label: " Revenue",
			data: dashboard.rent?.paidThisYear?.data,
			backgroundColor: "rgba(40, 167, 69, 1)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "25",
			stack: "Stack 1",
		},
		{
			label: " Revenue Due",
			data: dashboard.rent?.unpaidThisYear?.data,
			backgroundColor: "rgba(40, 167, 69, 0.5)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "25",
			stack: "Stack 1",
		},
		{
			label: " Leads",
			data: dashboard.water?.paidThisYear?.data,
			backgroundColor: "rgba(54, 162, 235, 1)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "25",
			stack: "Stack 2",
		},
		{
			label: " Leads Lost",
			data: dashboard.water?.unpaidThisYear?.data,
			backgroundColor: "rgba(54, 162, 235, 0.5)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "25",
			stack: "Stack 2",
		},
		{
			label: " Completed Tasks",
			data: dashboard.serviceCharge?.paidThisYear?.data,
			backgroundColor: "rgba(220, 53, 69, 1)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "25",
			stack: "Stack 3",
		},
		{
			label: " Uncompleted Tasks",
			data: dashboard.serviceCharge?.unpaidThisYear?.data,
			backgroundColor: "rgba(220, 53, 69, 0.5)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "25",
			stack: "Stack 3",
		},
	]

	var doughnutRent = [
		{
			label: " KES",
			data: [
				dashboard.rent?.paid,
				dashboard.rent?.percentage > 100 ? 0 : dashboard.rent?.due,
			],
			backgroundColor: ["rgba(40, 167, 69, 1)", "rgba(40, 167, 69, 0.5)"],
		},
	]

	var doughnutLeads = [
		{
			label: " KES",
			data: [
				dashboard.water?.paid,
				dashboard.water?.percentage > 100 ? 0 : dashboard.water?.due,
			],
			backgroundColor: ["rgba(54, 162, 235, 1)", "rgba(54, 162, 235, 0.5)"],
		},
	]

	var doughnutTasks = [
		{
			label: " KES",
			data: [
				dashboard.serviceCharge?.paid,
				dashboard.serviceCharge?.percentage > 100
					? 0
					: dashboard.serviceCharge?.due,
			],
			backgroundColor: ["rgba(220, 53, 69, 1)", "rgba(220, 53, 69, 0.5)"],
		},
	]

	var pieWaterUsage = [
		{
			label: " KES",
			data: [
				dashboard.water?.usageTwoMonthsAgo,
				dashboard.water?.usageLastMonth,
			],
			backgroundColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
		},
	]

	return (
		<React.Fragment>
			<div className="row">
				<div className="col-sm-12">
					<div className="d-flex flex-wrap justify-content-start">
						<ChartBox
							title={"Leads"}
							total={10}
							icon={<PeopleSVG />}
							growth={-1}
							data={lineGraphLeads}
							datasets={lineGraphLeads}
						/>
						<ChartBox
							title={"Revenue"}
							total={10}
							icon={<MoneySVG />}
							growth={5}
							data={lineGraphRevenue}
							datasets={lineGraphRevenue}
						/>
						<ChartBox
							title={"Projects"}
							total={10}
							icon={<PeopleSVG />}
							growth={4}
							data={lineGraphProjects}
							datasets={lineGraphProjects}
						/>
						<ChartBox
							title={"Tasks"}
							total={10}
							icon={<MoneySVG />}
							growth={0}
							data={lineGraphTasks}
							datasets={lineGraphTasks}
						/>
					</div>
				</div>
			</div>

			{/* Leads Start */}
			<div className="row">
				<div className="col-sm-8">
					<h4 className="my-3">This month</h4>
					<div className="card shadow-sm hidden-scroll">
						{dashboard.rent && (
							<Bar
								labels={dashboard.rent?.paidThisYear.labels}
								datasets={barGraphLeads}
							/>
						)}
					</div>
				</div>
				<div className="col-sm-4">
					<h4 className="my-3">This month</h4>
					<div className="d-flex justify-content-between flex-wrap">
						{/* Revenue Doughnut */}
						<div className="card shadow-sm text-center me-2 mb-2">
							<div className="middle3">
								<h3>
									{dashboard.rent?.percentage}
									<small className="fs-6">%</small>
								</h3>
							</div>
							{dashboard.rent && (
								<Doughnut
									labels={["Revenue", "Revenue Due"]}
									datasets={doughnutRent}
									cutout="60%"
									size="12.5em"
								/>
							)}
							<div className="d-flex justify-content-center pb-3">
								<h6>
									Total:
									<small className="mx-1">KES</small>
									{dashboard.rent?.total}
								</h6>
							</div>
						</div>
						{/* Revenue Doughnut End */}
						{/* Leads Doughnut */}
						<div className="card shadow-sm text-center me-2 mb-2">
							<div className="middle3">
								<h3>
									{dashboard.water?.percentage}
									<small className="fs-6">%</small>
								</h3>
							</div>
							{dashboard.water && (
								<Doughnut
									labels={["Leads", "Leads Lost"]}
									datasets={doughnutLeads}
									cutout="60%"
									size="12.5em"
								/>
							)}
							<div className="d-flex justify-content-center pb-3">
								<h6>Total: 200</h6>
							</div>
						</div>
						{/* Leads Doughnut End */}
						{/* Tasks Doughnut */}
						<div className="card shadow-sm text-center me-2 mb-2">
							<div className="middle3">
								<h3>
									{dashboard.serviceCharge?.percentage}
									<small className="fs-6">%</small>
								</h3>
							</div>
							{dashboard.serviceCharge && (
								<Doughnut
									labels={["Tasks", "Tasks Lost"]}
									datasets={doughnutTasks}
									cutout="60%"
									size="12.5em"
								/>
							)}
							<div className="d-flex justify-content-center pb-3">
								<h6>Total: 500</h6>
							</div>
						</div>
						{/* Tasks Doughnut End */}
						{/* Water Usage Pie */}
						<div className="card shadow-sm text-center me-2 mb-2">
							{dashboard.water && (
								<Pie
									labels={["", ""]}
									datasets={pieWaterUsage}
									size="12.5em"
								/>
							)}
							<div className="d-flex justify-content-center pb-3">
								<h6>Total:</h6>
							</div>
						</div>
						{/* Water Usage Pie End */}
					</div>
				</div>
			</div>
			{/* Leads Start */}

			<br />
			{/*
			 * Tenancy
			 */}

			<div className="row">
				<div className="col-sm-6">
					{/* Customers Table */}
					<div className="table-responsive mb-5">
						<table className="table table-hover">
							<thead>
								<tr>
									<th colSpan="5">
										<h4>Recent Customers</h4>
									</th>
								</tr>
								<tr>
									<th>#</th>
									<th>Name</th>
									<th>Email</th>
									<th>Phone</th>
									<th>Acquired On</th>
								</tr>
								{dashboard.units?.list.slice(0, 10).map((unit, key) => (
									<tr key={key}>
										<td>{key + 1}</td>
										<td>{unit.tenantName}</td>
										<td>{unit.tenantEmail}</td>
										<td>{unit.tenantPhone}</td>
										<td>{unit.tenantOccupiedAt}</td>
									</tr>
								))}
								<tr>
									<td colSpan="4"></td>
									<td className="text-end">
										<MyLink
											linkTo="/dashboard"
											text="view more"
										/>
									</td>
								</tr>
							</thead>
						</table>
						{/* Customers Table End */}
					</div>
				</div>

				<div className="col-sm-6">
					{/* Recent Payments Table */}
					<div className="table-responsive">
						<table className="table table-hover">
							<thead>
								<tr>
									<th colSpan="4">
										<h4>Recent Payments</h4>
									</th>
								</tr>
								<tr>
									<th>#</th>
									<th>Customer</th>
									<th>Amount</th>
									<th>Paid On</th>
								</tr>
							</thead>
							<tbody>
								{payments.data?.slice(0, 10).map((payment, key) => (
									<tr key={key}>
										<td>{props.iterator(key, payments)}</td>
										<td>{payment.tenantName}</td>
										<td className="text-success">
											<small>KES</small> {payment.amount}
										</td>
										<td>{payment.paidOn}</td>
									</tr>
								))}
								<tr>
									<td colSpan="3"></td>
									<td className="text-end">
										<MyLink
											linkTo="/dashboard"
											text="view more"
										/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					{/* Recent Payments Table End */}
				</div>
			</div>

			<div className="row">
				<div className="col-sm-6">
					{/* Suppliers Table */}
					<div className="table-responsive">
						<table className="table table-hover">
							<thead>
								<tr>
									<th colSpan="5">
										<h4>Suppliers</h4>
									</th>
								</tr>
								<tr>
									<th>#</th>
									<th>Name</th>
									<th>Email</th>
									<th>Phone</th>
									<th>Location</th>
								</tr>
							</thead>
							<tbody>
								{staff.data?.slice(0, 10).map((staffMember, key) => (
									<tr key={key}>
										<td>{props.iterator(key, staff)}</td>
										<td>
											<Img
												src={staffMember.avatar}
												className="rounded-circle"
												width="25px"
												height="25px"
												alt="Avatar"
											/>
										</td>
										<td>{staffMember.name}</td>
										<td>{staffMember.phone}</td>
										<td>
											{staffMember.roleNames?.map((role, key) => (
												<span key={key}>
													{key != 0 && <span className="mx-1">|</span>}
													{role}
												</span>
											))}
										</td>
									</tr>
								))}
								<tr>
									<td colSpan="4"></td>
									<td className="text-end">
										<MyLink
											linkTo="/dashboard"
											text="view more"
										/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					{/* Suppliers Table End */}
				</div>
				<div className="col-sm-6">
					{/* Staff Table */}
					<div className="table-responsive">
						<table className="table table-hover">
							<thead>
								<tr>
									<th colSpan="5">
										<h4>Staff</h4>
									</th>
								</tr>
								<tr>
									<th>#</th>
									<th></th>
									<th>Name</th>
									<th>Phone</th>
									<th>Role</th>
								</tr>
							</thead>
							<tbody>
								{staff.data?.slice(0, 10).map((staffMember, key) => (
									<tr key={key}>
										<td>{props.iterator(key, staff)}</td>
										<td>
											<Img
												src={staffMember.avatar}
												className="rounded-circle"
												width="25px"
												height="25px"
												alt="Avatar"
											/>
										</td>
										<td>{staffMember.name}</td>
										<td>{staffMember.phone}</td>
										<td>
											{staffMember.roleNames?.map((role, key) => (
												<span key={key}>
													{key != 0 && <span className="mx-1">|</span>}
													{role}
												</span>
											))}
										</td>
									</tr>
								))}
								<tr>
									<td colSpan="4"></td>
									<td className="text-end">
										<MyLink
											linkTo="/dashboard"
											text="view more"
										/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					{/* Staff Table End */}
				</div>
			</div>
		</React.Fragment>
	)
}

export default index
