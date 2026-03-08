import React from "react"
import { Route } from "react-router-dom"

import Header from "@/components/Layouts/Header"
import Index from "@/pages/index"
import ClientRegister from "@/pages/clients/register"

import AdminNav from "@/components/Layouts/AdminNav"

import AdminDashboard from "@/pages/admin/index"
import AdminProjectDashboard from "@/pages/admin/erp-dashboard"

import AdminClients from "@/pages/admin/erp/clients/index"
import AdminClientCreate from "@/pages/admin/erp/clients/create"
import AdminClientView from "@/pages/admin/erp/clients/[id]"
import AdminClientEdit from "@/pages/admin/erp/clients/edit/[id]"

import AdminGoods from "@/pages/admin/erp/goods/index"
import AdminGoodCreate from "@/pages/admin/erp/goods/create"
import AdminGoodEdit from "@/pages/admin/erp/goods/edit/[id]"

import AdminServiceProviders from "@/pages/admin/erp/service-providers/index"
import AdminServiceProviderCreate from "@/pages/admin/erp/service-providers/create"
import AdminServiceProviderView from "@/pages/admin/erp/service-providers/[id]"
import AdminServiceProviderEdit from "@/pages/admin/erp/service-providers/edit/[id]"

import AdminProjects from "@/pages/admin/erp/projects/index"
import AdminProjectCreate from "@/pages/admin/erp/projects/create"
import AdminProjectView from "@/pages/admin/erp/projects/[id]"
import AdminProjectEdit from "@/pages/admin/erp/projects/edit/[id]"

import AdminWorkPlanCreate from "@/pages/admin/erp/work-plan/create"
import AdminWorkPlanEdit from "@/pages/admin/erp/work-plan/edit/[id]"

import AdminWorkPlanStepCreate from "@/pages/admin/erp/work-plan-step/create"
import AdminWorkPlanStepEdit from "@/pages/admin/erp/work-plan-step/edit/[id]"

import AdminInventory from "@/pages/admin/erp/inventory/index"
import AdminInventoryCreate from "@/pages/admin/erp/inventory/create"
import AdminInventoryEdit from "@/pages/admin/erp/inventory/edit/[id]"

import AdminProjectServiceProviderCreate from "@/pages/admin/erp/projects/service-providers/create"
import AdminProjectServiceProviderEdit from "@/pages/admin/erp/projects/service-providers/edit/[id]"

import AdminSuppliers from "@/pages/admin/erp/suppliers/index"
import AdminSupplierCreate from "@/pages/admin/erp/suppliers/create"
import AdminSupplierView from "@/pages/admin/erp/suppliers/[id]"
import AdminSupplierEdit from "@/pages/admin/erp/suppliers/edit/[id]"

import AdminSupplierGoodCreate from "@/pages/admin/erp/supplier-goods/create"
import AdminSupplierGoodEdit from "@/pages/admin/erp/supplier-goods/edit/[id]"

import AdminIssues from "@/pages/admin/erp/issues/index"

import AdminDeliveryNotes from "@/pages/admin/documents/delivery-notes/index"
import AdminDeliveryNoteView from "@/pages/admin/documents/delivery-notes/[id]"
import AdminDeliveryNoteEdit from "@/pages/admin/documents/delivery-notes/edit/[id]"

import AdminWageSheets from "@/pages/admin/documents/wage-sheets/index"
import AdminWageSheetCreate from "@/pages/admin/documents/wage-sheets/create"
import AdminWageSheetView from "@/pages/admin/documents/wage-sheets/[id]"
import AdminWageSheetEdit from "@/pages/admin/documents/wage-sheets/edit/[id]"

import AdminStatusReports from "@/pages/admin/documents/status-reports/index"
import AdminStatusReportCreate from "@/pages/admin/documents/status-reports/create"
import AdminStatusReportView from "@/pages/admin/documents/status-reports/[id]"
import AdminStatusReportEdit from "@/pages/admin/documents/status-reports/edit/[id]"

import AdminPracticalCompletionCertificates from "@/pages/admin/documents/practical-completion-certificates/index"
import AdminPracticalCompletionCertificateCreate from "@/pages/admin/documents/practical-completion-certificates/create"
import AdminPracticalCompletionCertificateView from "@/pages/admin/documents/practical-completion-certificates/[id]"
import AdminPracticalCompletionCertificateEdit from "@/pages/admin/documents/practical-completion-certificates/edit/[id]"

import AdminSiteVisitReports from "@/pages/admin/documents/site-visit-reports/index"
import AdminSiteVisitReportCreate from "@/pages/admin/documents/site-visit-reports/create"
import AdminSiteVisitReportView from "@/pages/admin/documents/site-visit-reports/[id]"
import AdminSiteVisitReportEdit from "@/pages/admin/documents/site-visit-reports/edit/[id]"

import AdminRequisitions from "@/pages/admin/documents/requisitions/index"
import AdminRequisitionCreate from "@/pages/admin/documents/requisitions/create"
import AdminRequisitionView from "@/pages/admin/documents/requisitions/[id]"
import AdminRequisitionEdit from "@/pages/admin/documents/requisitions/edit/[id]"

import AdminInvoices from "@/pages/admin/invoices/index"
import AdminInvoiceCreate from "@/pages/admin/invoices/create"
import AdminInvoiceView from "@/pages/admin/invoices/[id]"
import AdminInvoiceEdit from "@/pages/admin/invoices/edit/[id]"

import AdminPayments from "@/pages/admin/payments/index"
import AdminPaymentCreate from "@/pages/admin/payments/create"
import AdminPaymentEdit from "@/pages/admin/payments/edit/[id]"

import AdminCreditNotes from "@/pages/admin/credit-notes/index"
import AdminCreditNoteCreate from "@/pages/admin/credit-notes/create"
import AdminCreditNoteEdit from "@/pages/admin/credit-notes/edit/[id]"

import AdminStaff from "@/pages/admin/erp/staff/index"
import AdminStaffCreate from "@/pages/admin/erp/staff/create"
import AdminStaffEdit from "@/pages/admin/erp/staff/edit/[id]"

import AdminRoleIndex from "@/pages/admin/roles"
import AdminRoleCreate from "@/pages/admin/roles/create"
import AdminRoleEdit from "@/pages/admin/roles/edit/[id]"

import AdminConfigurations from "@/pages/admin/configurations"

const RouteList = ({ GLOBAL_STATE }) => {
	const routes = [
		{
			path: "/",
			component: <Index {...GLOBAL_STATE} />,
		},
		{
			path: "/clients/register",
			component: <ClientRegister {...GLOBAL_STATE} />,
		},
	]

	// Admin Routes
	const adminRoutes = [
		{
			path: "/admin/dashboard",
			component: <AdminDashboard {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/dashboard",
			component: <AdminProjectDashboard {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/clients",
			component: <AdminClients {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/clients/create",
			component: <AdminClientCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/clients/:id/view",
			component: <AdminClientView {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/clients/:id/edit",
			component: <AdminClientEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/goods",
			component: <AdminGoods {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/goods/create",
			component: <AdminGoodCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/goods/:id/edit",
			component: <AdminGoodEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/service-providers",
			component: <AdminServiceProviders {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/service-providers/create",
			component: <AdminServiceProviderCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/service-providers/:id/view",
			component: <AdminServiceProviderView {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/service-providers/:id/edit",
			component: <AdminServiceProviderEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/projects",
			component: <AdminProjects {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/projects/create",
			component: <AdminProjectCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/projects/:id/view",
			component: <AdminProjectView {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/projects/:id/edit",
			component: <AdminProjectEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/work-plan/:id/create",
			component: <AdminWorkPlanCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/work-plan/:id/edit",
			component: <AdminWorkPlanEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/work-plan-step/:id/create",
			component: <AdminWorkPlanStepCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/work-plan-step/:id/edit",
			component: <AdminWorkPlanStepEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/inventories",
			component: <AdminInventory {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/inventory/:id/create",
			component: <AdminInventoryCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/inventory/:id/edit",
			component: <AdminInventoryEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/projects/service-providers/:id/create",
			component: <AdminProjectServiceProviderCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/projects/service-providers/:id/edit",
			component: <AdminProjectServiceProviderEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/suppliers",
			component: <AdminSuppliers {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/suppliers/create",
			component: <AdminSupplierCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/suppliers/:id/view",
			component: <AdminSupplierView {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/suppliers/:id/edit",
			component: <AdminSupplierEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/supplier-goods/:id/create",
			component: <AdminSupplierGoodCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/supplier-goods/:id/edit",
			component: <AdminSupplierGoodEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/erp/issues",
			component: <AdminIssues {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/delivery-notes",
			component: <AdminDeliveryNotes {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/delivery-notes/:id/view",
			component: <AdminDeliveryNoteView {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/delivery-notes/:id/edit",
			component: <AdminDeliveryNoteEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/wage-sheets",
			component: <AdminWageSheets {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/wage-sheets/create",
			component: <AdminWageSheetCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/wage-sheets/:id/view",
			component: <AdminWageSheetView {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/wage-sheets/:id/edit",
			component: <AdminWageSheetEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/status-reports",
			component: <AdminStatusReports {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/status-reports/create",
			component: <AdminStatusReportCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/status-reports/:id/view",
			component: <AdminStatusReportView {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/status-reports/:id/edit",
			component: <AdminStatusReportEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/practical-completion-certificates",
			component: <AdminPracticalCompletionCertificates {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/practical-completion-certificates/create",
			component: (
				<AdminPracticalCompletionCertificateCreate {...GLOBAL_STATE} />
			),
		},
		{
			path: "/admin/documents/practical-completion-certificates/:id/view",
			component: <AdminPracticalCompletionCertificateView {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/practical-completion-certificates/:id/edit",
			component: <AdminPracticalCompletionCertificateEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/site-visit-reports",
			component: <AdminSiteVisitReports {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/site-visit-reports/create",
			component: <AdminSiteVisitReportCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/site-visit-reports/:id/view",
			component: <AdminSiteVisitReportView {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/site-visit-reports/:id/edit",
			component: <AdminSiteVisitReportEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/requisitions",
			component: <AdminRequisitions {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/requisitions/create",
			component: <AdminRequisitionCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/requisitions/:id/view",
			component: <AdminRequisitionView {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/documents/requisitions/:id/edit",
			component: <AdminRequisitionEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/invoices",
			component: <AdminInvoices {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/invoices/create",
			component: <AdminInvoiceCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/invoices/:id/view",
			component: <AdminInvoiceView {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/invoices/:id/edit",
			component: <AdminInvoiceEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/payments",
			component: <AdminPayments {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/payments/:id/create",
			component: <AdminPaymentCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/payments/:id/edit",
			component: <AdminPaymentEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/credit-notes",
			component: <AdminCreditNotes {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/credit-notes/:id/create",
			component: <AdminCreditNoteCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/credit-notes/:id/edit",
			component: <AdminCreditNoteEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/staff",
			component: <AdminStaff {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/staff/:id/create",
			component: <AdminStaffCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/staff/:id/edit",
			component: <AdminStaffEdit {...GLOBAL_STATE} />,
		},
		{ path: "/admin/roles", component: <AdminRoleIndex {...GLOBAL_STATE} /> },
		{
			path: "/admin/roles/create",
			component: <AdminRoleCreate {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/roles/:id/edit",
			component: <AdminRoleEdit {...GLOBAL_STATE} />,
		},
		{
			path: "/admin/configurations",
			component: <AdminConfigurations {...GLOBAL_STATE} />,
		},
	]

	return (
		<React.Fragment>
			<Header {...GLOBAL_STATE}>
				{/* Landing Page routes */}
				{routes.map((route, key) => (
					<Route
						key={key}
						path={route.path}
						exact
						render={() => route.component}
					/>
				))}
				{/* Landing Page routes End */}
			</Header>

			<AdminNav {...GLOBAL_STATE}>
				{/* Admin Routes */}
				{adminRoutes.map((route, key) => (
					<Route
						key={key}
						path={route.path}
						exact
						render={() => route.component}
					/>
				))}
				{/* Admin Routes End */}
			</AdminNav>
		</React.Fragment>
	)
}

export default RouteList
