import React, { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

import Btn from "@/components/Core/Btn"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import PlusSVG from "@/svgs/PlusSVG"
import ViewSVG from "@/svgs/ViewSVG"
import HighPrioritySVG from "@/svgs/HighPrioritySVG"
import MediumPrioritySVG from "@/svgs/MediumPrioritySVG"
import LowPrioritySVG from "@/svgs/LowPrioritySVG"
import IssueSVG from "@/svgs/IssueSVG"

const IssueBoard = (props) => {
	const location = useLocation()
	/*
	 * Reorder Issues
	 */
	const onIssueReorder = (idsAndPositions) => {
		Axios.put(`api/issues/reorder/1`, {
			idsAndPositions: idsAndPositions,
		})
			.then((res) => {
				props.setMessages([res.data.message])
				// Fetch Stages
				props.get("stages?type=issue", props.setStages)
			})
			.catch((err) => props.gerErrors(err))
	}

	/*
	 * Update Issue
	 */
	const onUpdateIssueStage = (id, stageId) => {
		Axios.put(`api/issues/${id}`, {
			stageId: stageId,
		})
			.then((res) => {
				// Fetch Stages
				props.get("stages?type=issue", props.setStages)
				props.setMessages([res.data.message])
			})
			.catch((err) => {
				props.getErrors(err)
			})
	}

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list)
		const [removed] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)

		return result
	}

	/**
	 * Moves an item from one list to another list.
	 */
	const move = (source, destination, droppableSource, droppableDestination) => {
		const sourceClone = Array.from(source)
		const destClone = Array.from(destination)
		const [removed] = sourceClone.splice(droppableSource.index, 1)

		destClone.splice(droppableDestination.index, 0, removed)

		const result = {}
		result[droppableSource.droppableId] = sourceClone
		result[droppableDestination.droppableId] = destClone

		return result
	}

	function onDragEnd(result) {
		const { source, destination } = result

		// dropped outside the list
		if (!destination) {
			return
		}
		const soureId = +source.droppableId
		const destinationId = +destination.droppableId

		// Check if issue has changed stages
		if (soureId === destinationId) {
			const items = reorder(layout[soureId], source.index, destination.index)
			const newState = [...layout]
			newState[soureId] = items

			let issueIdsAndPositions = items.map((issue, key) => ({
				id: issue.id,
				position: key,
			}))

			onIssueReorder(issueIdsAndPositions)
			setLayout(newState)
		} else {
			const result = move(
				layout[soureId],
				layout[destinationId],
				source,
				destination
			)
			const newState = [...layout]
			newState[soureId] = result[soureId]
			newState[destinationId] = result[destinationId]

			let stageId = props.stages[destinationId].id
			let issueId = result[destinationId][destination.index].id

			onUpdateIssueStage(issueId, stageId)

			setLayout(newState)
		}
	}

	const [layout, setLayout] = useState([])

	useEffect(() => {
		let newLayout = []

		props.stages.forEach((stage) => newLayout.push(stage.issues))
		setLayout(newLayout)
	}, [props.stages])

	return (
		<div>
			{/* Data */}
			<div className="card shadow-sm mb-2 p-2">
				<div className="d-flex justify-content-between">
					{/* Total */}
					<div className="d-flex justify-content-between flex-wrap w-100 align-items-center mx-4">
						{/* Total */}
						<HeroHeading
							heading="Total"
							data={props.issues.length}
						/>
						<HeroIcon>
							<IssueSVG />
						</HeroIcon>
						{/* Total End */}
					</div>
				</div>
				{/* Total End */}
			</div>
			{/* Data End */}

			<br />

			{/* Filters */}
			{location.pathname.match("/issues") && (
				<div className="card shadow-sm py-2 px-4">
					<div className="d-flex justify-content-end flex-wrap">
						{/* Name */}
						<div className="flex-grow-1 me-2 mb-2">
							<label htmlFor="">Title / Code</label>
							<input
								type="text"
								placeholder="Search by Title or Code"
								className="form-control"
								onChange={(e) => props.setTitleQuery(e.target.value)}
							/>
						</div>
						{/* Name End */}
						{/* Priority */}
						<div className="flex-grow-1 me-2 mb-2">
							<label htmlFor="">Priority</label>
							<select
								type="text"
								className="form-control text-capitalize mb-2"
								onChange={(e) => props.setPriorityQuery(e.target.value)}
								required={true}>
								{[
									{ id: "", name: "Select Priority" },
									{ id: "low", name: "Low" },
									{ id: "medium", name: "Medium" },
									{ id: "high", name: "High" },
								].map((priority, key) => (
									<option
										key={key}
										value={priority.id}
										selected={props.priorityQuery == priority}>
										{priority.name}
									</option>
								))}
							</select>
						</div>
						{/* Priority End */}
						{/* Project */}
						<div className="flex-grow-1 me-2 mb-2">
							<label htmlFor="">Project</label>
							<select
								className="form-control"
								onChange={(e) => props.setProjectIdQuery(e.target.value)}>
								{[{ id: "", name: "Select Project" }]
									.concat(props.projects)
									.map((project, key) => (
										<option
											key={key}
											value={project.id}
											selected={key == project}>
											{project.name}
										</option>
									))}
							</select>
						</div>
						{/* Project End */}
						{/* Staff */}
						<div className="flex-grow-1 me-2 mb-2">
							<label htmlFor="">Staff</label>
							<select
								className="form-control"
								onChange={(e) => props.setStaffIdQuery(e.target.value)}>
								{[{ id: "", name: "Select Staff" }]
									.concat(props.staff)
									.map((staff, key) => (
										<option
											key={key}
											value={staff.id}
											selected={key == staff}>
											{staff.name}
										</option>
									))}
							</select>
						</div>
						{/* Staff End */}
						{/* Start Date */}
						<div className="d-flex flex-grow-1">
							{/* Start Month */}
							<div className="flex-grow-1 me-2 mb-2">
								<label htmlFor="">Start At</label>
								<select
									className="form-control"
									onChange={(e) =>
										props.setStartMonthQuery(
											e.target.value == "0" ? "" : e.target.value
										)
									}>
									{props.months.map((month, key) => (
										<option
											key={key}
											value={key}
											selected={key == props.startMonthQuery}>
											{month}
										</option>
									))}
								</select>
							</div>
							{/* Start Month End */}
							{/* Start Year */}
							<div className="me-2 mb-2">
								<label
									htmlFor=""
									className="invisible">
									Start At
								</label>
								<select
									className="form-control"
									onChange={(e) => props.setStartYearQuery(e.target.value)}>
									<option value="">Select Year</option>
									{props.years.map((year, key) => (
										<option
											key={key}
											value={year}
											selected={year == props.startYearQuery}>
											{year}
										</option>
									))}
								</select>
							</div>
							{/* Start Year End */}
						</div>
						{/* Start Date End */}
						{/* End Date */}
						<div className="d-flex flex-grow-1">
							{/* End Month */}
							<div className="flex-grow-1 me-2 mb-2">
								<label htmlFor="">End At</label>
								<select
									className="form-control"
									onChange={(e) =>
										props.setEndMonthQuery(
											e.target.value == "0" ? "" : e.target.value
										)
									}>
									{props.months.map((month, key) => (
										<option
											key={key}
											value={key}
											selected={key == props.endMonthQuery}>
											{month}
										</option>
									))}
								</select>
							</div>
							{/* End Month End */}
							{/* End Year */}
							<div className="me-2 mb-2">
								<label
									htmlFor=""
									className="invisible">
									End At
								</label>
								<select
									className="form-control"
									onChange={(e) => props.setEndYearQuery(e.target.value)}>
									<option value="">Select Year</option>
									{props.years.map((year, key) => (
										<option
											key={key}
											value={year}
											selected={year == props.endYearQuery}>
											{year}
										</option>
									))}
								</select>
							</div>
							{/* End Year End */}
						</div>
						{/* End Date End */}
					</div>
				</div>
			)}
			{/* Filters End */}

			<br />

			{/* Buttons Start */}
			<div className="d-flex m-1">
				{/* Stage Modal Start */}
				<Btn
					icon={<PlusSVG />}
					text="create stage"
					dataBsToggle="modal"
					dataBsTarget={`#createStageModal`}
					className="me-1"
					onClick={() => {
						props.setCreatingStage(true)
						props.setStageId("")
						props.setStageName("")
						props.setStagePosition("")
					}}
				/>
				{/* Stage Modal End */}

				{/* Trigger Modal Start */}
				{props.stages.length > 0 && (
					<Btn
						icon={<PlusSVG />}
						text="create issue"
						dataBsToggle="modal"
						dataBsTarget={`#createIssueModal`}
						className="me-1"
						onClick={() => {
							props.setCreatingIssue(true)
							props.setIssueId("")
							props.setIssueTitle("")
							props.setIssueDescription("")
							props.setIssueAssignedTo("")
							props.setIssuePlannedStartDate("")
							props.setIssuePlannedEndDate("")
							props.setIssuePriority("")
							props.setIssueProjectId("")
							props.setIssueStageId("")
						}}
					/>
				)}
				{/* Trigger Modal End */}
			</div>
			{/* Buttons End */}

			<div className="hidden-scroll">
				<div className="d-flex mt-2">
					<DragDropContext onDragEnd={onDragEnd}>
						{layout.map((stage, stageKey) => (
							<div
								key={stageKey}
								className="d-flex flex-column shadow mb-5 mx-1"
								style={{ border: "1px solid rgba(255, 255, 255, 0.3)" }}>
								{/* Stage Title Start */}
								<h6 className="p-2 text-center">
									{props.stages[stageKey]?.name}

									<div>
										{/* Stage Modal Start */}
										<Btn
											icon={<ViewSVG />}
											text="view"
											dataBsToggle="modal"
											dataBsTarget={`#createStageModal`}
											className="mysonar-sm mt-1 ms-1"
											onClick={() => {
												props.setCreatingStage(false)
												props.setStageId(props.stages[stageKey].id)
												props.setStageName(props.stages[stageKey].name)
												props.setStagePosition(props.stages[stageKey].position)
											}}
										/>
									</div>
									{/* Stage Modal End */}
								</h6>
								{/* Stage Title End */}
								{/* Stage Start */}
								<Droppable
									key={stageKey}
									droppableId={`${stageKey}`}>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											className={`${
												snapshot.isDraggingOver ? "bg-warning-subtle" : ""
											}`}
											style={{ width: "250px", minHeight: "200px" }}
											{...provided.droppableProps}>
											{/* Issue Start */}
											{stage.map((issue, index) => (
												<Draggable
													key={issue.id}
													draggableId={issue.id.toString()}
													index={index}>
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className={`d-flex justify-content-between glass shadow-sm m-2 p-2 ${
																snapshot.isDragging ? "shadow-lg" : ""
															}`}>
															<div>
																<div className="fw-normal text-primary">
																	{issue.code}
																</div>
																<div className="text-wrap">{issue.title}</div>
																<small className="bg-primary-subtle text-muted rounded-pill px-1">
																	{issue.assignedToName}
																</small>
																{/* <div>
																	<small className="text-primary">
																		ID: {issue.id}
																	</small>
																</div>
																<div>
																	<small className="text-primary">
																		Stage ID: {issue.currentStageId}
																	</small>
																</div>
																<div>
																	<small className="text-secondary">
																		New:{" "}
																		{issue.new ? (
																			<span className="text-success">True</span>
																		) : (
																			<span className="text-danger">False</span>
																		)}
																	</small>
																</div> */}
															</div>
															<div className="d-flex flex-column justify-content-between text-center">
																<Btn
																	icon={<ViewSVG />}
																	dataBsToggle="modal"
																	dataBsTarget={`#createIssueModal`}
																	className="me-1"
																	onClick={() => {
																		props.setCreatingIssue(false)
																		props.setIssueId(issue.id)
																		props.setIssueTitle(issue.title)
																		props.setIssueDescription(issue.description)
																		props.setIssueAssignedTo(issue.assignedToId)
																		props.setIssuePlannedStartDate(
																			issue.plannedStartDateRaw
																		)
																		props.setIssuePlannedEndDate(
																			issue.plannedEndDateRaw
																		)
																		props.setIssuePriority(issue.priority)
																		props.setIssueProjectId(issue.projectId)
																		props.setIssueStageId(issue.stageId)
																	}}
																/>

																<div>
																	{issue.priority == "high" ? (
																		<span className="text-danger">
																			<HighPrioritySVG />
																		</span>
																	) : issue.priority == "medium" ? (
																		<span className="text-warning">
																			<MediumPrioritySVG />
																		</span>
																	) : (
																		<span className="text-success">
																			<LowPrioritySVG />
																		</span>
																	)}
																</div>
															</div>
														</div>
													)}
												</Draggable>
											))}
											{/* Issue End */}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
								{/* Stage End */}
							</div>
						))}
					</DragDropContext>
				</div>
			</div>
		</div>
	)
}

export default IssueBoard
