import React, { useEffect, useState } from "react"
import {
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"
import CloseSVG from "@/svgs/CloseSVG"
import PlusSVG from "@/svgs/PlusSVG"

const create = (props) => {
	const history = useHistory()

	const [projects, setProjects] = useState([])

	const [projectId, setProjectId] = useState()
	const [employer, setEmployer] = useState()
	const [contractor, setContractor] = useState()
	const [projectManager, setProjectManager] = useState()
	const [brief, setBrief] = useState()
	const [contractDates, setContractDates] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Create Practical Completion Certificate",
			path: ["practical-completion-certificates", "create"],
		})
		// Fetch Projects
		props.get("projects?idAndName=true", setProjects)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.post("/api/practical-completion-certificates", {
			projectId: projectId,
			employer: employer,
			contractor: contractor,
			projectManager: projectManager,
			brief: brief,
			contractDates: contractDates,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])

				// Redirect to Practical Completion Certificates
				setTimeout(
					() =>
						history.push(`/admin/documents/practical-completion-certificates`),
					500
				)
			})
			.catch((err) => {
				setLoading(false)
				// Get Errors
				props.getErrors(err)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-4"></div>
			<div className="col-sm-4">
				<form onSubmit={onSubmit}>
					{/* Project Start */}
					<select
						name="projectId"
						className="form-control mb-2 me-1"
						onChange={(e) => setProjectId(Number.parseInt(e.target.value))}
						required={true}>
						<option value="">Select Project</option>
						{projects.map((project, key) => (
							<option
								key={key}
								value={project.id}>
								{project.name}
							</option>
						))}
					</select>
					{/* Project End */}

					{/* Employer Start */}
					<input
						type="text"
						placeholder="Employer"
						className="form-control mb-2"
						onChange={(e) => setEmployer(e.target.value)}
						required={true}
					/>
					{/* Employer End */}

					{/* Contractor Start */}
					<input
						type="text"
						placeholder="Contractor"
						className="form-control mb-2"
						onChange={(e) => setContractor(e.target.value)}
						required={true}
					/>
					{/* Contractor End */}

					{/* Project Manager Start */}
					<input
						type="text"
						placeholder="Project Manager"
						className="form-control mb-2"
						onChange={(e) => setProjectManager(e.target.value)}
						required={true}
					/>
					{/* Project Manager End */}

					{/* Brief Start */}
					<textarea
						type="text"
						placeholder="Brief"
						cols="5"
						rows="5"
						className="form-control mb-2"
						onChange={(e) => setBrief(e.target.value)}
						required={true}></textarea>
					{/* Brief End */}

					{/* Contract Dates Start */}
					<input
						type="date"
						placeholder="Contract Dates"
						className="form-control mb-2"
						onChange={(e) => setContractDates(e.target.value)}
						required={true}
					/>
					{/* Contract Dates End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="create practical completion certificate"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/documents/practical-completion-certificates`}
							icon={<BackSVG />}
							text="back to practical completion certificates"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default create
