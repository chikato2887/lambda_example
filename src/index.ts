import chromium from 'chrome-aws-lambda'

// @ts-ignore
export const handler = async (event) => {
	let result = null;
	let browser = null;
	const questionId = event.queryStringParameters['id']

	try {
		browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

		let page = await browser.newPage();

    await page.goto(`https://ogp-test-site.vercel.app/og-image/questions/${questionId}`);

    result = await page.screenshot({fullPage: false, type: "png"})

	} catch (error) {
		return console.error("error has occured: ", error)
	} finally {
		if (browser != null) {
			await browser.close()
		}
	}

	const response = {
		statusCode: 200,
		headers: {
			'Content-Type': 'image/png',
		},
		body: result.toString('utf8'),
		isBase64Encoded: true
	}
	console.log("base64: ", result.toString('utf8'))
	return response
}

if (process.env.NODE_ENV == 'develop') {
	handler({queryStringParameters: {id: '1'}})
}
