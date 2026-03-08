import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond"

// Import FilePond styles
import "filepond/dist/filepond.min.css"

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import FilePondPluginImageCrop from "filepond-plugin-image-crop"
import FilePondPluginImageTransform from "filepond-plugin-image-transform"
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

// Register the plugins
registerPlugin(
	FilePondPluginImageExifOrientation,
	FilePondPluginImagePreview,
	FilePondPluginFileValidateType,
	FilePondPluginImageCrop,
	FilePondPluginImageTransform,
	FilePondPluginFileValidateSize
)

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import CloseSVG from "@/svgs/CloseSVG"
import BackSVG from "@/svgs/BackSVG"

const edit = (props) => {
	var { id } = useParams()

	const [serviceProvider, setServiceProvider] = useState({})

	const [name, setName] = useState()
	const [email, setEmail] = useState()
	const [phone, setPhone] = useState()
	const [idNumber, setIdNumber] = useState([])

	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Service Provider",
			path: ["service-providers", "edit"],
		})
		// Fetch ServiceProvider
		props.get(`service-providers/${id}`, setServiceProvider)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.put(`/api/service-providers/${id}`, {
			name: name,
			email: email,
			phone: phone,
			idNumber: idNumber,
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
				<form onSubmit={onSubmit}>
					{/* Name Start */}
					<label htmlFor="">Name</label>
					<input
						type="text"
						name="name"
						placeholder="John Doe"
						defaultValue={serviceProvider.name}
						className="form-control mb-2 me-2"
						onChange={(e) => setName(e.target.value)}
					/>
					{/* Name End */}

					{/* Email Start */}
					<label htmlFor="">Email</label>
					<input
						type="text"
						placeholder="johndoe@gmail.com"
						defaultValue={serviceProvider.email}
						className="form-control mb-2 me-2"
						onChange={(e) => setEmail(e.target.value)}
					/>
					{/* Email End */}

					{/* Phone Start */}
					<label htmlFor="">Phone</label>
					<input
						type="tel"
						placeholder="0722123456"
						defaultValue={serviceProvider.phone}
						className="form-control mb-2 me-2"
						onChange={(e) => setPhone(e.target.value)}
					/>
					{/* Phone End */}

					{/* ID Number Start */}
					<label htmlFor="">ID Number</label>
					<input
						type="number"
						placeholder="31531513"
						defaultValue={serviceProvider.idNumber}
						className="form-control mb-2 me-2"
						onChange={(e) => setIdNumber(e.target.value)}
					/>
					{/* ID Number End */}

					{/* Upload ID Start */}
					<label htmlFor="">Upload ID</label>
					<div className="card shadow-sm mb-3">
						<FilePond
							name="filepond-national-id"
							className="m-2"
							labelIdle='Drag & Drop your File or <span class="filepond--label-action text-dark"> Browse </span>'
							acceptedFileTypes={["application/pdf"]}
							allowRevert={false}
							server={{
								url: `/api/filepond/`,
								process: {
									url: `national-id/${serviceProvider.id}`,
									onload: (res) => props.setMessages([res]),
									onerror: (err) => console.error(err.response.data),
								},
							}}
						/>
					</div>
					{/* Upload ID End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update service provider"
							loading={loading}
						/>
					</div>

					<center className="mb-5">
						<MyLink
							linkTo={`/erp/service-providers`}
							icon={<BackSVG />}
							text="back to service providers"
						/>
					</center>

					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default edit
