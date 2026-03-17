import React, { useEffect, useState } from "react"

import ProductList from "@/components/Products/ProductList"

const index = (props) => {
	const [products, setProducts] = useState(props.getLocalStorage("products"))

	const [code, setCodeQuery] = useState("")
	const [name, setNameQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Products", path: ["products"] })
	}, [])

	useEffect(() => {
		// Fetch Products
		props.getPaginated(
			`products?
			code=${code}&
			name=${name}`,
			setProducts,
			"products"
		)
	}, [code, name])

	return (
		<ProductList
			{...props}
			products={products}
			setProducts={setProducts}
			setCodeQuery={setCodeQuery}
			setNameQuery={setNameQuery}
		/>
	)
}

export default index
