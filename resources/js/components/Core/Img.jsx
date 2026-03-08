import React from "react"

const Img = ({ src, width, height, className, style, alt }) => {
	return (
		<img
			src={src ?? "/storage/img/android-chrome-512x512.png"}
			width={width}
			height={height}
			className={className}
			style={style}
			alt={alt}
			loading="lazy"
		/>
	)
}

export default Img