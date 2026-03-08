import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import DeleteModal from "@/components/Core/DeleteModal"
import HeroIcon from "@/components/Core/HeroIcon"
import HeroHeading from "@/components/Core/HeroHeading"

import PaginationLinks from "@/components/Core/PaginationLinks"

import WorkPlanSVG from "@/svgs/WorkPlanSVG"
import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"

const WorkPlanList = (props) => {
	const [workPlanSteps, setWorkPlanSteps] = useState([])

	useEffect(() => {
		// Fetch Work Plan Steps
		props.get("work-plan-steps", setWorkPlanSteps)
	}, [])

	/*
	 * Delete Work Plan
	 */
	const onDeleteWorkPlan = (workPlanId) => {
		Axios.delete(`/api/work-plans/${workPlanId}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setWorkPlans({
					meta: props.workPlans.meta,
					links: props.workPlans.links,
					data: props.workPlans.data.filter(
						(workPlan) => workPlan.id != workPlanId
					),
				})
				// Update Project
				props.get(`projects/${props.projectId}`, props.setProject)
			})
			.catch((err) => props.getErrors(err))
	}

	/*
	 * Delete Work Plan Step
	 */
	const onDeleteWorkPlanStep = (workPlanStepId) => {
		Axios.delete(`api/work-plan-steps/${workPlanStepId}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Fetch Work Plan Steps
				props.get("work-plan-steps", setWorkPlanSteps)
			})
			.catch((err) => props.getErrors(err))
	}

	return (
		<div className={props.activeTab}>
			{/* Data */}
			<div className="card shadow-sm mb-2 p-2">
				<div className="d-flex justify-content-between">
					{/* Total */}
					<div className="d-flex justify-content-between w-100 align-items-center mx-4">
						<HeroHeading
							heading="Total Work Plan Items"
							data={props.totalWorkPlans}
						/>
						<HeroIcon>
							<WorkPlanSVG />
						</HeroIcon>
					</div>
					{/* Total End */}
				</div>
			</div>
			{/* Data End */}

			<br />

			{/* Table */}
			<div className="table-responsive mb-5">
				<table className="table table-hover">
					<thead>
						<tr>
							<th colSpan="5"></th>
							<th className="text-end">
								<MyLink
									linkTo={`/erp/work-plan/${props.projectId}/create`}
									icon={<PlusSVG />}
									text="add work plan item"
								/>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th>Project Code</th>
							<th>Name</th>
							<th>Starts At</th>
							<th>Ends At</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{props.workPlans.data?.map((workPlan, key) => (
							<React.Fragment key={key}>
								<tr key={key}>
									<td>{props.iterator(key, props.workPlans)}</td>
									<td>{workPlan.projectCode}</td>
									<td>{workPlan.name}</td>
									<td className="text-capitalize">{workPlan.startsAt}</td>
									<td className="text-capitalize">{workPlan.endsAt}</td>
									<td>
										<div className="d-flex justify-content-center">
											<MyLink
												linkTo={`/erp/work-plan-step/${workPlan.id}/create`}
												icon={<PlusSVG />}
												text="add substep"
											/>

											<MyLink
												linkTo={`/erp/work-plan/${workPlan.id}/edit`}
												icon={<EditSVG />}
												className="ms-1"
											/>

											<div className="mx-1">
												<DeleteModal
													index={`workPlan${key}`}
													model={workPlan}
													modelName="Work Plan"
													onDelete={onDeleteWorkPlan}
												/>
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<td
										colSpan={6}
										className="p-0">
										<div
											className="accordion rounded-4"
											id="accordionExample">
											<div className="accordion-item rounded-4">
												<h2 className="accordion-header">
													<button
														className={`accordion-button rounded-4 ${
															key != 0 && "collapsed"
														}`}
														type="button"
														data-bs-toggle="collapse"
														data-bs-target={`#collapse${key}`}
														aria-expanded="true"
														aria-controls={`collapse${key}`}>
														Sub Steps
													</button>
												</h2>
												<div
													id={`collapse${key}`}
													className={`accordion-collapse collapse ${
														key == 0 && "show"
													}`}
													data-bs-parent="#accordionExample">
													<div className="accordion-body p-0">
														<table className="table table-hover table-primary table-borderless mb-0">
															<thead>
																<tr>
																	<th colSpan={3}></th>
																	<th>#</th>
																	<th>Name</th>
																	<th>Starts At</th>
																	<th>Ends At</th>
																	<th></th>
																</tr>
															</thead>
															<tbody>
																{workPlanSteps
																	.filter(
																		(workPlanStep) =>
																			workPlanStep.workPlanId == workPlan.id
																	)
																	.map((workPlanStep, workPlanStepKey) => (
																		<tr key={workPlanStepKey}>
																			<td
																				colSpan={3}
																				className="pt-2"></td>
																			<td className="pt-2">
																				{workPlanStepKey + 1}
																			</td>
																			<td className="pt-2">
																				{workPlanStep.name}
																			</td>
																			<td className="pt-2 text-capitalize">
																				{workPlanStep.startsAt}
																			</td>
																			<td className="pt-2 text-capitalize">
																				{workPlanStep.endsAt}
																			</td>
																			<td className="pt-2">
																				<div className="d-flex justify-content-center">
																					<MyLink
																						linkTo={`/erp/work-plan-step/${workPlanStep.id}/edit`}
																						icon={<EditSVG />}
																						className="ms-1"
																					/>

																					<div className="mx-1">
																						<DeleteModal
																							index={`workPlanStep${workPlanStepKey}`}
																							model={workPlanStep}
																							modelName="Work Plan Step"
																							onDelete={onDeleteWorkPlanStep}
																						/>
																					</div>
																				</div>
																			</td>
																		</tr>
																	))}
															</tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
									</td>
								</tr>
							</React.Fragment>
						))}
					</tbody>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={props.workPlans}
					getPaginated={props.getPaginated}
					setState={props.setWorkPlans}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default WorkPlanList
