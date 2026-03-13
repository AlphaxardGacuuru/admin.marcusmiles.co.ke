import React, { useEffect, useState } from "react"

import MyLink from "@/components/Core/MyLink"
import Img from "@/components/Core/Img"

import Bar from "@/components/Charts/Bar"
import Doughnut from "@/components/Charts/Doughnut"
import Pie from "@/components/Charts/Pie"
import ChartBox from "@/components/Core/ChartBox"

import PersonSVG from "@/svgs/PersonSVG"
import InvoiceSVG from "@/svgs/InvoiceSVG"
import ProductSVG from "@/svgs/ProductSVG"
import PeopleSVG from "@/svgs/PeopleSVG"
import PaymentSVG from "@/svgs/PaymentSVG"
import CreditNoteSVG from "@/svgs/CreditNoteSVG"

const index = (props) => {
	const [clientsDashboard, setClientsDashboard] = useState(
		props.getLocalStorage("clientsDashboard", {})
	)
	const [quotationsDashboard, setQuotationsDashboard] = useState(
		props.getLocalStorage("quotationsDashboard", {})
	)
	const [invoicesDashboard, setInvoicesDashboard] = useState(
		props.getLocalStorage("invoicesDashboard", {})
	)
	const [paymentsDashboard, setPaymentsDashboard] = useState(
		props.getLocalStorage("paymentsDashboard", {})
	)
	const [creditNotesDashboard, setCreditNotesDashboard] = useState(
		props.getLocalStorage("creditNotesDashboard", {})
	)

	useEffect(() => {
		// Set page
		props.setPage({ name: "Dashboard", path: ["crm/dashboard"] })

		// Fetch Dashboard
		Axios.get(`api/dashboard/crm`)
			.then((res) => {
				// Reset Data
				setClientsDashboard([])
				setQuotationsDashboard([])
				setInvoicesDashboard([])
				setPaymentsDashboard([])
				setCreditNotesDashboard([])

				setClientsDashboard(res.data.data.clients)
				setQuotationsDashboard(res.data.data.quotations)
				setInvoicesDashboard(res.data.data.invoices)
				setPaymentsDashboard(res.data.data.payments)
				setCreditNotesDashboard(res.data.data.creditNotes)
			})
			.catch(() => props.setErrors(["Failed to fetch Dashboard"]))
	}, [])

	/*
	 * Graph Data
	 */

	var lineGraphClients = [
		{
			label: "Last 7 Days",
			data: clientsDashboard.chartBox?.data,
			backgroundColor: "rgba(153, 102, 255, 1)",
			borderColor: "rgba(153, 102, 255, 1)",
			// borderWidth: 1,
		},
	]

	var lineGraphQuotations = [
		{
			label: "Last 7 days",
			data: quotationsDashboard.chartBox?.data,
			backgroundColor: "rgba(54, 162, 235, 1)",
			borderColor: "rgba(54, 162, 235, 1)",
			// borderWidth: 1,
		},
	]

	var lineGraphInvoices = [
		{
			label: "Last 7 Days",
			data: invoicesDashboard.chartBox?.data,
			backgroundColor: "rgba(220, 53, 69, 1)",
			borderColor: "rgba(220, 53, 69, 1)",
			// borderWidth: 1,
		},
	]

	var lineGraphPayments = [
		{
			label: "Last 7 Days",
			data: paymentsDashboard.chartBox?.data,
			backgroundColor: "rgba(40, 167, 69, 1)",
			borderColor: "rgba(40, 167, 69, 1)",
			// borderWidth: 1,
		},
	]

	var lineGraphCreditNotes = [
		{
			label: "Last 7 Days",
			data: creditNotesDashboard.chartBox?.data,
			backgroundColor: "rgba(253, 126, 20, 1)",
			borderColor: "rgba(253, 126, 20, 1)",
			// borderWidth: 1,
		},
	]

	var barGraphClients = [
		{
			label: "Clients this month",
			data: clientsDashboard.clientsThisYear?.data,
			backgroundColor: "rgba(54, 162, 235, 1)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "50",
			stack: "Stack 0",
		},
	]

	var barGraphQuotations = [
		{
			label: "Quotations this month",
			data: quotationsDashboard.quotationsThisYear?.data,
			backgroundColor: "rgba(40, 167, 69, 1)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "50",
			stack: "Stack 1",
		},
	]

	var barGraphInvoices = [
		{
			label: "Invoices this month",
			data: invoicesDashboard.invoicesThisYear?.data,
			backgroundColor: "rgba(220, 53, 69, 1)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "50",
			stack: "Stack 2",
		},
	]

	var barGraphPayments = [
		{
			label: "Payments this month",
			data: paymentsDashboard.paymentsThisYear?.data,
			backgroundColor: "rgba(40, 167, 69, 1)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "50",
			stack: "Stack 3",
		},
	]

	var barGraphCreditNotes = [
		{
			label: "Credit Notes this month",
			data: creditNotesDashboard.creditNotesThisYear?.data,
			backgroundColor: "rgba(253, 126, 20, 1)",
			borderColor: "rgba(255, 255, 255, 1)",
			borderWidth: 2,
			borderRadius: "0",
			barThickness: "50",
			stack: "Stack 4",
		},
	]

	return (
		<React.Fragment>
			<div className="row">
				<div className="col-sm-12">
					<div className="d-flex flex-wrap justify-content-start">
						{lineGraphClients[0].data && (
							<ChartBox
								link="/admin/crm/clients"
								title={"Clients"}
								total={clientsDashboard.chartBox?.total || 0}
								icon={<PersonSVG />}
								growth={clientsDashboard.chartBox?.growth || 0}
								data={lineGraphClients}
								datasets={lineGraphClients}
							/>
						)}
						{lineGraphQuotations[0].data && (
							<ChartBox
								link="/admin/crm/quotations"
								title={"Quotations"}
								total={quotationsDashboard.chartBox?.total || 0}
								icon={<PeopleSVG />}
								growth={quotationsDashboard.chartBox?.growth || 0}
								data={lineGraphQuotations}
								datasets={lineGraphQuotations}
							/>
						)}
						{lineGraphInvoices[0].data && (
							<ChartBox
								link="/admin/crm/invoices"
								title={"Invoices"}
								total={invoicesDashboard.chartBox?.total || 0}
								icon={<InvoiceSVG />}
								growth={invoicesDashboard.chartBox?.growth || 0}
								data={lineGraphInvoices}
								datasets={lineGraphInvoices}
							/>
						)}
						{lineGraphPayments[0].data && (
							<ChartBox
								link="/admin/crm/payments"
								title={"Payments"}
								total={paymentsDashboard.chartBox?.total || 0}
								icon={<PaymentSVG />}
								growth={paymentsDashboard.chartBox?.growth || 0}
								data={lineGraphPayments}
								datasets={lineGraphPayments}
							/>
						)}
						{lineGraphCreditNotes[0].data && (
							<ChartBox
								link="/admin/crm/credit-notes"
								title={"Credit Notes"}
								total={creditNotesDashboard.chartBox?.total || 0}
								icon={<CreditNoteSVG />}
								growth={creditNotesDashboard.chartBox?.growth || 0}
								data={lineGraphCreditNotes}
								datasets={lineGraphCreditNotes}
							/>
						)}
					</div>
				</div>
			</div>

			{/* Bar Start */}
			<div className="row">
				<div className="col-sm-8">
					<h4 className="my-3">This month</h4>
					<div className="card shadow-sm hidden-scroll">
						{clientsDashboard.clientsThisYear && (
							<Bar
								labels={clientsDashboard.clientsThisYear?.labels}
								datasets={[
									barGraphClients[0],
									barGraphQuotations[0],
									barGraphInvoices[0],
									barGraphPayments[0],
									barGraphCreditNotes[0],
								]}
							/>
						)}
					</div>
				</div>
				<div className="col-sm-4"></div>
			</div>
			{/* Bar Start */}
		</React.Fragment>
	)
}

export default index
