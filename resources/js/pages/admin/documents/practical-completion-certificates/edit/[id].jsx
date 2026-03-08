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

const edit = (props) => {
	const { id } = useParams()

	const [practicalCompletionCertificate, setPracticalCompletionCertificate] =
		useState({})

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
			name: "Edit Practical Completion Certificate",
			path: ["practical-completion-certificate", "edit"],
		})
		// Fetch Practical Completion Certificate
		props.get(
			`practical-completion-certificates/${id}`,
			setPracticalCompletionCertificate
		)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.put(`/api/practical-completion-certificates/${id}`, {
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
				<form onSubmit={onSubmit} className="my-5">
					{/* Employer Start */}
					<input
						type="text"
						placeholder="Employer"
						defaultValue={practicalCompletionCertificate.employer}
						className="form-control mb-2"
						onChange={(e) => setEmployer(e.target.value)}
					/>
					{/* Employer End */}

					{/* Contractor Start */}
					<input
						type="text"
						placeholder="Contractor"
						defaultValue={practicalCompletionCertificate.contractor}
						className="form-control mb-2"
						onChange={(e) => setContractor(e.target.value)}
					/>
					{/* Contractor End */}

					{/* Project Manager Start */}
					<input
						type="text"
						placeholder="Project Manager"
						defaultValue={practicalCompletionCertificate.projectManager}
						className="form-control mb-2"
						onChange={(e) => setProjectManager(e.target.value)}
					/>
					{/* Project Manager End */}

					{/* Brief Start */}
					<textarea
						type="text"
						placeholder="Brief"
						defaultValue={practicalCompletionCertificate.brief}
						cols="5"
						rows="5"
						className="form-control mb-2"
						onChange={(e) => setBrief(e.target.value)}></textarea>
					{/* Brief End */}

					{/* Contract Dates Start */}
					<input
						type="date"
						placeholder="Contract Dates"
						defaultValue={practicalCompletionCertificate.contractDatesRaw}
						className="form-control mb-2"
						onChange={(e) => setContractDates(e.target.value)}
					/>
					{/* Contract Dates End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update practical completion certificate"
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

export default edit
