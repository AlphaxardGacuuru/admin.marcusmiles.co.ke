import React from "react"

import MyLink from "@/components/Core/MyLink"

import PaginationLinks from "@/components/Core/PaginationLinks"
import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import ProjectSVG from "@/svgs/ProjectSVG"
import ViewSVG from "@/svgs/ViewSVG"

const ServiceProviderProjectList = (props) => {
	return (
		<div className={props.activeTab}>
			{/* Data */}
			<div className="card shadow-sm mb-2 p-2">
				<div className="d-flex justify-content-between">
					{/* Total */}
					<div className="d-flex justify-content-between flex-wrap w-100 align-items-center mx-4">
						{/* Total */}
						<HeroHeading
							heading="Total"
							data={props.projects.meta?.total}
						/>
						<HeroIcon>
							<ProjectSVG />
						</HeroIcon>
						{/* Total End */}
					</div>
				</div>
				{/* Total End */}
			</div>
			{/* Data End */}

			<br />

			{/* Filters */}
			<div className="card shadow-sm p-4">
				<div className="d-flex flex-wrap">
					{/* Name */}
					<div className="flex-grow-1 me-2 mb-2">
						<input
							id=""
							type="text"
							name="name"
							placeholder="Search by Name"
							className="form-control"
							onChange={(e) => props.setNameQuery(e.target.value)}
						/>
					</div>
					{/* Name End */}
				</div>
			</div>
			{/* Filters End */}

			<br />

			{/* Table */}
			<div className={`table-responsive mb-5`}>
				<table className="table table-hover">
					<thead>
						<tr>
							<th>#</th>
							<th>Name</th>
							<th>Type</th>
							<th>Location</th>
							<th>Created By</th>
							<th>Created At</th>
							<th className="text-center">Action</th>
						</tr>
						{props.projects.data?.map((project, key) => (
							<tr key={key}>
								<td>{project.projectCode}</td>
								<td>{project.projectName}</td>
								<td className="text-capitalize">{project.projectType}</td>
								<td>{project.projectLocation}</td>
								<td>{project.projectCreatedBy}</td>
								<td>{project.projectCreatedAt}</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/erp/projects/${project.id}/view`}
											className="me-1"
											icon={<ViewSVG />}
										/>
									</div>
								</td>
							</tr>
						))}
					</thead>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={props.projects}
					getPaginated={props.getPaginated}
					setState={props.setProjects}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default ServiceProviderProjectList
