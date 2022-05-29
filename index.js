exports.handler = async () => {
	const response = {
		statusCode: 200,
		body: JSON.stringify("hello from lambda and github")
	}
	return response
}


