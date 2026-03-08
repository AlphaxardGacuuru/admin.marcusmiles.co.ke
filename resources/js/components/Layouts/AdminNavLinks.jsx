import React, { useEffect, useState } from "react"
import {
	Link,
	useLocation,
	useHistory,
} from "react-router-dom/cjs/react-router-dom.min"

import PersonSVG from "@/svgs/PersonSVG"
import HomeSVG from "@/svgs/HomeSVG"
import PropertySVG from "@/svgs/PropertySVG"
import StaffSVG from "@/svgs/StaffSVG"
import MoneySVG from "@/svgs/MoneySVG"
import WalletSVG from "@/svgs/WalletSVG"
import PersonGearSVG from "@/svgs/PersonGearSVG"
import PaymentSVG from "@/svgs/PaymentSVG"
import InvoiceSVG from "@/svgs/InvoiceSVG"
import WaterReadingSVG from "@/svgs/WaterReadingSVG"
import CreditNoteSVG from "@/svgs/CreditNoteSVG"
import ProjectSVG from "@/svgs/ProjectSVG"
import ERPSVG from "@/svgs/ERPSVG"
import IssueSVG from "@/svgs/IssueSVG"
import SupplierSVG from "@/svgs/SupplierSVG"
import GoodSVG from "@/svgs/GoodSVG"
import InventorySVG from "@/svgs/InventorySVG"
import ServiceProviderSVG from "@/svgs/ServiceProviderSVG"
import SettingsSVG from "@/svgs/SettingsSVG"
import DocumentsSVG from "@/svgs/DocumentsSVG"
import PaperSVG from "@/svgs/PaperSVG"

const AdminNavLinks = (props) => {
	const location = useLocation()
	const history = useHistory()

	// Function for showing active color
	const active = (check) => {
		return (
			location.pathname.match(check) &&
			"rounded text-secondary bg-secondary-subtle mx-2"
		)
	}

	// Function for showing active color
	const activeStrict = (check) => {
		return (
			location.pathname == check &&
			"rounded text-secondary bg-secondary-subtle mx-2"
		)
	}

	return (
		<React.Fragment>
			{/* Dashboard Link */}
			<li className="nav-item">
				<Link
					to={`/admin/dashboard`}
					className={`nav-link my-1 ${active("/admin/dashboard")}`}>
					<div className="nav-link-icon">
						<HomeSVG />
					</div>
					<div className="nav-link-text">Dashboard</div>
				</Link>
			</li>
			{/* Dashboard Link End */}
			{/* ERP Links */}
			<li className="nav-item">
				<a
					href="#"
					className={`nav-link accordion-button w-75 my-1 ${active(
						"/admin/erp/"
					)}`}
					data-bs-toggle="collapse"
					data-bs-target="#collapseERP"
					aria-expanded="false"
					aria-controls="collapseERP">
					<div className="nav-link-icon">
						<ERPSVG />
					</div>
					<div className="nav-link-text">ERP</div>
				</a>

				{/* Collapse */}
				<div
					className={!location.pathname.match("/erp/") ? "collapse" : ""}
					id="collapseERP">
					<ol className="ms-4">
						{/* Dashboard */}
						<li className="nav-item">
							<Link
								to={`/admin/erp/dashboard`}
								className={`nav-link ${activeStrict("/admin/erp/dashboard")}`}>
								<div className="nav-link-icon">
									<HomeSVG />
								</div>
								<div className="nav-link-text">Dashboard</div>
							</Link>
						</li>
						{/* Dashboard End */}
						{/* Clients Start */}
						<li className="nav-item">
							<Link
								to={`/admin/erp/clients`}
								className={`nav-link ${active("/admin/erp/clients")}`}>
								<div className="nav-link-icon">
									<PersonSVG />
								</div>
								<div className="nav-link-text">Clients</div>
							</Link>
						</li>
						{/* Clients End */}
						{/* Goods Start */}
						<li className="nav-item">
							<Link
								to={`/admin/erp/goods`}
								className={`nav-link ${active("/admin/erp/goods")}`}>
								<div className="nav-link-icon">
									<GoodSVG />
								</div>
								<div className="nav-link-text">Goods</div>
							</Link>
						</li>
						{/* Goods End */}
						{/* Service Providers Start */}
						<li className="nav-item">
							<Link
								to={`/admin/erp/service-providers`}
								className={`nav-link ${active(
									"/admin/erp/service-providers"
								)}`}>
								<div className="nav-link-icon">
									<ServiceProviderSVG />
								</div>
								<div className="nav-link-text">Service Providers</div>
							</Link>
						</li>
						{/* Service Providers End */}
						{/* Projects Start */}
						<li className="nav-item">
							<Link
								to={`/admin/erp/projects`}
								className={`nav-link ${
									active("/admin/erp/projects") ||
									active("/admin/erp/work-plan") ||
									active("/admin/erp/inventory")
								}`}>
								<div className="nav-link-icon">
									<ProjectSVG />
								</div>
								<div className="nav-link-text">Projects</div>
							</Link>
						</li>
						{/* Projects End */}
						{/* Suppliers Start */}
						<li className="nav-item">
							<Link
								to={`/admin/erp/suppliers`}
								className={`nav-link ${active("/admin/erp/suppliers")}`}>
								<div className="nav-link-icon">
									<SupplierSVG />
								</div>
								<div className="nav-link-text">Suppliers</div>
							</Link>
						</li>
						{/* Suppliers End */}
						{/* Inventory Start */}
						<li className="nav-item">
							<Link
								to={`/admin/erp/inventories`}
								className={`nav-link ${active("/admin/erp/inventories")}`}>
								<div className="nav-link-icon">
									<InventorySVG />
								</div>
								<div className="nav-link-text">Inventory</div>
							</Link>
						</li>
						{/* Inventory End */}
						{/* Issues Start */}
						<li className="nav-item">
							<Link
								to={`/admin/erp/issues`}
								className={`nav-link ${active("/admin/erp/issues")}`}>
								<div className="nav-link-icon">
									<IssueSVG />
								</div>
								<div className="nav-link-text">Issues</div>
							</Link>
						</li>
						{/* Issues End */}
					</ol>
				</div>
				{/* Collapse End */}
			</li>
			{/* ERP Links End */}
			{/* Documents Links */}
			<li className="nav-item">
				<a
					href="#"
					className={`nav-link accordion-button w-75 my-1 ${active(
						"/admin/documents/"
					)}`}
					data-bs-toggle="collapse"
					data-bs-target="#collapseDocuments"
					aria-expanded="false"
					aria-controls="collapseDocuments">
					<div className="nav-link-icon">
						<DocumentsSVG />
					</div>
					<div className="nav-link-text">Documents</div>
				</a>

				{/* Collapse */}
				<div
					className={!location.pathname.match("/documents/") ? "collapse" : ""}
					id="collapseDocuments">
					<ol className="ms-4">
						{/* Delivery Notes Start */}
						<li className="nav-item">
							<Link
								to={`/admin/documents/delivery-notes`}
								className={`nav-link ${active(
									"/admin/documents/delivery-notes"
								)}`}>
								<div className="nav-link-icon">
									<PaperSVG />
								</div>
								<div className="nav-link-text">Delivery Notes</div>
							</Link>
						</li>
						{/* Delivery Notes End */}
						{/* Wage Sheets Start */}
						<li className="nav-item">
							<Link
								to={`/admin/documents/wage-sheets`}
								className={`nav-link ${active(
									"/admin/documents/wage-sheets"
								)}`}>
								<div className="nav-link-icon">
									<PaperSVG />
								</div>
								<div className="nav-link-text">Wage Sheets</div>
							</Link>
						</li>
						{/* Wage Sheets End */}
						{/* Status Reports Start */}
						<li className="nav-item">
							<Link
								to={`/admin/documents/status-reports`}
								className={`nav-link ${active(
									"/admin/documents/status-reports"
								)}`}>
								<div className="nav-link-icon">
									<PaperSVG />
								</div>
								<div className="nav-link-text">Status Reports</div>
							</Link>
						</li>
						{/* Status Reports End */}
						{/* Practical Completion Certificates Start */}
						<li className="nav-item">
							<Link
								to={`/admin/documents/practical-completion-certificates`}
								className={`nav-link ${active(
									"/admin/documents/practical-completion-certificates"
								)}`}>
								<div className="nav-link-icon">
									<PaperSVG />
								</div>
								<div className="nav-link-text">
									Practical Completion Certificates
								</div>
							</Link>
						</li>
						{/* Practical Completion Certificates End */}
						{/* Site Visit Reports Start */}
						<li className="nav-item">
							<Link
								to={`/admin/documents/site-visit-reports`}
								className={`nav-link ${active(
									"/admin/documents/site-visit-reports"
								)}`}>
								<div className="nav-link-icon">
									<PaperSVG />
								</div>
								<div className="nav-link-text">Site Visit Reports</div>
							</Link>
						</li>
						{/* Site Visit Reports End */}
						{/* Requisitions Start */}
						<li className="nav-item">
							<Link
								to={`/admin/documents/requisitions`}
								className={`nav-link ${active(
									"/admin/documents/requisitions"
								)}`}>
								<div className="nav-link-icon">
									<PaperSVG />
								</div>
								<div className="nav-link-text">Requisitions</div>
							</Link>
						</li>
						{/* Requisitions End */}
					</ol>
				</div>
				{/* Collapse End */}
			</li>
			{/* Documents Links End */}
			{/* Configurations Link */}
			<li className="nav-item">
				<Link
					to={`/admin/configurations`}
					className={`nav-link my-1 ${active("/admin/configurations")}`}>
					<div className="nav-link-icon">
						<SettingsSVG />
					</div>
					<div className="nav-link-text">Configurations</div>
				</Link>
			</li>
			{/* Configurations Link End */}
		</React.Fragment>
	)
}

export default AdminNavLinks
