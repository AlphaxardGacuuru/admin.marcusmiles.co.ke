import React, { useEffect, useState } from "react"

import MyLink from "@/components/Core/MyLink"
import Img from "@/components/Core/Img"

import Bar from "@/components/Charts/Bar"
import Doughnut from "@/components/Charts/Doughnut"
import Pie from "@/components/Charts/Pie"
import ChartBox from "@/components/Core/ChartBox"

import ProjectSVG from "@/svgs/ProjectSVG"
import IssueSVG from "@/svgs/IssueSVG"
import MoneySVG from "@/svgs/MoneySVG"
import ProductSVG from "@/svgs/ProductSVG"
import PeopleSVG from "@/svgs/PeopleSVG"

const index = (props) => {
	const [projectsDashboard, setProjectsDashboard] = useState(
		props.getLocalStorage("projectsDashboard", {})
	)
	const [inventoriesDashboard, setInventoriesDashboard] = useState(
		props.getLocalStorage("inventoriesDashboard", {})
	)
	const [issuesDashboard, setIssuesDashboard] = useState(
		props.getLocalStorage("issuesDashboard", {})
	)

	useEffect(() => {
		// Set page
		props.setPage({ name: "Dashboard", path: ["erp/dashboard"] })

		// Fetch Dashboard
		Axios.get(`api/dashboard/erp`)
			.then((res) => {
				// Reset Data
				setProjectsDashboard([])
				setInventoriesDashboard([])
				setIssuesDashboard([])

				setProjectsDashboard(res.data.data.projects)
				setInventoriesDashboard(res.data.data.inventories)
				setIssuesDashboard(res.data.data.issues)
			})
			.catch(() => props.setErrors(["Failed to fetch Dashboard"]))
	}, [])

	/*
	 * Graph Data
	 */

	var lineGraphProjects = [
		{
			label: "Last 7 Days",
			data: projectsDashboard.chartBox?.data,
			backgroundColor: "rgba(153, 102, 255, 1)",
			borderColor: "rgba(153, 102, 255, 1)",
			// borderWidth: 1,
		},
	]

	var lineGraphInventories = [
		{
			label: "Last 7 days",
			data: inventoriesDashboard.chartBox?.data,
			backgroundColor: "rgba(54, 162, 235, 1)",
			borderColor: "rgba(54, 162, 235, 1)",
			// borderWidth: 1,
		},
	]

	var lineGraphIssues = [
		{
			label: "Last 7 Days",
			data: issuesDashboard.chartBox?.data,
			backgroundColor: "rgba(220, 53, 69, 1)",
			borderColor: "rgba(220, 53, 69, 1)",
			// borderWidth: 1,
		},
	]

	var barGraphProjects = [
		{
			label: "Projects this month",
			data: projectsDashboard.projectsThisYear?.data,
			backgroundColor: "rgba(54, 162, 235, 1)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "50",
			stack: "Stack 0",
		},
	]

	var barGraphInventories = [
		{
			label: "Inventory this month",
			data: inventoriesDashboard.inventoriesThisYear?.data,
			backgroundColor: "rgba(40, 167, 69, 1)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "50",
			stack: "Stack 1",
		},
	]

	var barGraphIssues = [
		{
			label: "Issues this month",
			data: issuesDashboard.issuesThisYear?.data,
			backgroundColor: "rgba(220, 53, 69, 1)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "50",
			stack: "Stack 2",
		},
	]

	return (
		<React.Fragment>
			<div className="row">
				<div className="col-sm-12">
					<div className="d-flex flex-wrap justify-content-start">
						{lineGraphProjects[0].data && (
							<ChartBox
								link="/admin/erp/projects"
								title={"Projects"}
								total={projectsDashboard.chartBox?.total || 0}
								icon={<ProjectSVG />}
								growth={projectsDashboard.chartBox?.growth || 0}
								data={lineGraphProjects}
								datasets={lineGraphProjects}
							/>
						)}
						{lineGraphInventories[0].data && (
							<ChartBox
								link="/admin/erp/inventories"
								title={"Inventory"}
								total={inventoriesDashboard.chartBox?.total || 0}
								icon={<PeopleSVG />}
								growth={inventoriesDashboard.chartBox?.growth || 0}
								data={lineGraphInventories}
								datasets={lineGraphInventories}
							/>
						)}
						{lineGraphIssues[0].data && (
							<ChartBox
								link="/admin/erp/issues"
								title={"Tasks"}
								total={issuesDashboard.chartBox?.total || 0}
								icon={<IssueSVG />}
								growth={issuesDashboard.chartBox?.growth || 0}
								data={lineGraphIssues}
								datasets={lineGraphIssues}
							/>
						)}
					</div>
				</div>
			</div>

			{/* Bar Start */}
			<div className="row">
				<div className="col-sm-8">
					<h4 className="my-3">This month</h4>
					<div className="card shadow-sm hidden-scroll">
						{projectsDashboard.projectsThisYear && (
							<Bar
								labels={projectsDashboard.projectsThisYear?.labels}
								datasets={[
									barGraphProjects[0],
									barGraphInventories[0],
									barGraphIssues[0],
								]}
							/>
						)}
					</div>
				</div>
				<div className="col-sm-4"></div>
			</div>
			{/* Bar Start */}
		</React.Fragment>
	)
}

export default index
