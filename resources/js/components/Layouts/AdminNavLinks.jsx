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
import CustomerSVG from "@/svgs/CustomerSVG"
import QuotationSVG from "@/svgs/QuotationSVG"
import OrderSVG from "@/svgs/OrderSVG"
import ProductSVG from "@/svgs/ProductSVG"
import ClientTrackingSVG from "@/svgs/ClientTrackingSVG"

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

	const navLinks = [
		{
			link: "/admin/dashboard",
			icon: <HomeSVG />,
			name: "Dashboard",
		},
		{
			collapse: "ERP",
			icon: <ERPSVG />,
			links: [
				{
					link: "/admin/erp/dashboard",
					icon: <HomeSVG />,
					name: "Dashboard",
				},
				{
					link: "/admin/erp/goods",
					icon: <GoodSVG />,
					name: "Goods",
				},
				{
					link: "/admin/erp/service-providers",
					icon: <ServiceProviderSVG />,
					name: "Service Providers",
				},
				{
					link: "/admin/erp/projects",
					icon: <ProjectSVG />,
					name: "Projects",
				},
				{
					link: "/admin/erp/suppliers",
					icon: <SupplierSVG />,
					name: "Suppliers",
				},
				{
					link: "/admin/erp/inventories",
					icon: <InventorySVG />,
					name: "Inventories",
				},
				{
					link: "/admin/erp/issues",
					icon: <IssueSVG />,
					name: "Issues",
				},
			],
		},
		{
			collapse: "Documents",
			icon: <DocumentsSVG />,
			links: [
				{
					link: "/admin/documents/delivery-notes",
					icon: <PaperSVG />,
					name: "Delivery Notes",
				},
				{
					link: "/admin/documents/wage-sheets",
					icon: <PaperSVG />,
					name: "Wage Sheets",
				},
				{
					link: "/admin/documents/status-reports",
					icon: <PaperSVG />,
					name: "Status Reports",
				},
				{
					link: "/admin/documents/practical-completion-certificates",
					icon: <PaperSVG />,
					name: "Practical Completion Certificates",
				},
				{
					link: "/admin/documents/site-visit-reports",
					icon: <PaperSVG />,
					name: "Site Visit Reports",
				},
				{
					link: "/admin/documents/requisitions",
					icon: <PaperSVG />,
					name: "Requisitions",
				},
			],
		},
		{
			collapse: "CRM",
			icon: <StaffSVG />,
			links: [
				{
					link: "/admin/crm/dashboard",
					icon: <HomeSVG />,
					name: "Dashboard",
				},
				{
					link: "/admin/crm/clients",
					icon: <PersonSVG />,
					name: "Clients",
				},
				{
					link: "/admin/crm/quotations",
					icon: <QuotationSVG />,
					name: "Quotations",
				},
				{
					link: "/admin/crm/products",
					icon: <ProductSVG />,
					name: "Products",
				},
				{
					link: "/admin/crm/orders",
					icon: <OrderSVG />,
					name: "Orders",
				},
				{
					link: "/admin/crm/invoices",
					icon: <InvoiceSVG />,
					name: "Invoices",
				},
				{
					link: "/admin/crm/payments",
					icon: <PaymentSVG />,
					name: "Payments",
				},
				{
					link: "/admin/crm/credit-notes",
					icon: <CreditNoteSVG />,
					name: "Credit Notes",
				},
				{
					link: "/admin/crm/staff",
					icon: <StaffSVG />,
					name: "Staff",
				},
				{
					link: "/admin/crm/roles",
					icon: <PersonGearSVG />,
					name: "Roles",
				},
			],
		},
		{
			link: "/admin/configurations",
			icon: <SettingsSVG />,
			name: "Configurations",
		},
	]

	/*
	 * Handle Permissions
	 */
	const can = (entity) => {
		if (props.auth.roleNames?.some((roleName) => roleName === "Super Admin")) {
			return
		}

		if (Array.isArray(entity)) {
			var hasAtleastOnePersmission = entity.some((entityName) => {
				if (["support"].includes(entityName)) {
					return true
				} else {
					const permissions = props.auth.permissions

					const hasPermission = permissions?.some((perm) => perm.match(entity))

					return hasPermission
				}
			})

			return hasAtleastOnePersmission ? "" : "d-none"
		} else {
			if (["dashboard", "support"].includes(entity)) {
				return true
			}

			const permissions = props.auth.permissions

			const hasPermission = permissions?.some((perm) => perm.match(entity))

			return hasPermission ? "" : "d-none"
		}
	}

	return (
		<React.Fragment>
			{navLinks.map((navLink, key) => (
				<React.Fragment key={key}>
					{!navLink.collapse ? (
						<li
							key={key}
							className={`nav-item hidden ${can(navLink.name.toLowerCase())}`}>
							<Link
								to={navLink.link}
								className={`nav-link ${active(navLink.link)}`}>
								<div className="nav-link-icon">{navLink.icon}</div>
								<div className="nav-link-text">{navLink.name}</div>
							</Link>
						</li>
					) : (
						<li
							className={`nav-item hidden ${can(
								navLink.links.map((link) => link.name.toLowerCase())
							)}`}>
							<Link
								to={navLink.link}
								className={`nav-link accordion-button w-75 my-1 ${navLink.links
									.map((link) => active(link.link))
									.join(" ")}`}
								data-bs-toggle="collapse"
								data-bs-target={`#collapse${key}`}
								aria-expanded="false"
								aria-controls={`collapse${key}`}>
								<div className="nav-link-icon">{navLink.icon}</div>
								<div className="nav-link-text">{navLink.collapse}</div>
							</Link>

							{/* Collapse */}
							<div
								className={"collapse"}
								id={`collapse${key}`}>
								<ol className="ms-4">
									{/* Link Start */}
									{navLink.links.map((link, index) => (
										<li
											className={`nav-item ${can(link.name.toLowerCase())}`}
											key={index}>
											<Link
												to={link.link}
												className={`nav-link ${active(link.link)}`}>
												<div className="nav-link-icon">{link.icon}</div>
												<div className="nav-link-text">{link.name}</div>
											</Link>
										</li>
									))}
									{/* Link End */}
								</ol>
							</div>
							{/* Collapse End */}
						</li>
					)}
				</React.Fragment>
			))}

			{/* Mobile Start */}
			{navLinks.map((navLink, key) => (
				<React.Fragment key={key}>
					{!navLink.collapse ? (
						<li
							key={key}
							className={`nav-item anti-hidden ${can(
								navLink.name.toLowerCase()
							)}`}>
							<Link
								to={navLink.link}
								className={`nav-link ${active(navLink.link)}`}
								onClick={() => props.setAdminMenu("")}>
								<div className="nav-link-icon">{navLink.icon}</div>
								<div className="nav-link-text">{navLink.name}</div>
							</Link>
						</li>
					) : (
						<li
							className={`nav-item anti-hidden ${can(
								navLink.links.map((link) => link.name.toLowerCase())
							)}`}>
							<Link
								to={navLink.link}
								className={`nav-link accordion-button w-75 my-1 ${navLink.links
									.map((link) => active(link.link))
									.join(" ")}`}
								data-bs-toggle="collapse"
								data-bs-target={`#collapse${key}`}
								aria-expanded="false"
								aria-controls={`collapse${key}`}>
								<div className="nav-link-icon">{navLink.icon}</div>
								<div className="nav-link-text">{navLink.collapse}</div>
							</Link>

							{/* Collapse */}
							<div
								className={"collapse"}
								id={`collapse${key}`}>
								<ol className="ms-4">
									{/* Link Start */}
									{navLink.links.map((link, index) => (
										<li
											className={`nav-item ${can(link.name.toLowerCase())}`}
											key={index}>
											<Link
												to={link.link}
												className={`nav-link ${active(link.link)}`}
												onClick={() => props.setAdminMenu("")}>
												<div className="nav-link-icon">{link.icon}</div>
												<div className="nav-link-text">{link.name}</div>
											</Link>
										</li>
									))}
									{/* Link End */}
								</ol>
							</div>
							{/* Collapse End */}
						</li>
					)}
				</React.Fragment>
			))}
			{/* Mobile End */}
		</React.Fragment>
	)
}

export default AdminNavLinks
