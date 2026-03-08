import React from "react"
import { Link, useLocation } from "react-router-dom"

import Img from "@/components/Core/Img"

import LogoSVG from "@/svgs/LogoSVG"
import MenuSVG from "@/svgs/MenuSVG"
import CloseSVG from "@/svgs/CloseSVG"

window.onscroll = () => {
	if (window.pageYOffset > 0) {
		document.getElementById("header-area").classList.add("sticky")
	} else {
		document.getElementById("header-area").classList.remove("sticky")
	}
}

const Header = (props) => {
	const location = useLocation()

	// Show Admin Nav based on Location
	const showHeader =
		!location.pathname.match("/admin/") &&
		!location.pathname.match("/instructor/") &&
		!location.pathname.match("/student/")
			? "d-block"
			: "d-none"

	return (
		<div
			id="MyElement"
			className={props.headerMenu + " " + showHeader}>
			{/* Preloader Start */}
			{/* <div id="preloader">
				<div className="preload-content">
					<div id="sonar-load"></div>
				</div>
			</div> */}
			{/* Preloader End */}

			{/* <!-- ***** Header Area Start ***** --> */}
			<header
				id="header-area"
				className="header-area">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="menu-area d-flex justify-content-between my-3">
								{/* <!-- Logo Area  --> */}
								<div className="logo-area">
									<Link
										to="/"
										className="text-white">
										<Img
											src="/storage/img/logo.svg"
											style={{ width: "8em", height: "auto" }}
										/>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>
			{/* <!-- ***** Header Area End ***** --> */}
			{props.children}
		</div>
	)
}

export default Header
