import React, { useEffect, useState } from "react"

import OrderList from "@/components/Orders/OrderList"

const index = (props) => {
	// Get Order
	const [orders, setOrders] = useState(props.getLocalStorage("orders"))

	const [codeQuery, setCodeQuery] = useState("")
	const [nameQuery, setNameQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Orders", path: ["crm/orders"] })
	}, [])

	useEffect(() => {
		props.getPaginated(
			`orders?
		code=${codeQuery}&
		name=${nameQuery}`,
			setOrders,
			"orders"
		)
	}, [codeQuery, nameQuery])

	return (
		<div className="row">
			<div className="col-sm-12">
				{/* Orders Tab */}
				<OrderList
					{...props}
					orders={orders}
					setOrders={setOrders}
					setCodeQuery={setCodeQuery}
					setNameQuery={setNameQuery}
				/>
				{/* Orders Tab End */}
			</div>
		</div>
	)
}

export default index
