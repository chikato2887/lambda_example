import chromium from 'chrome-aws-lambda'

// @ts-ignore
export const handler = async (event) => {
	let result = null;
	let browser = null;
	const questionId = event.queryStringParameters['id']
	await chromium.font('https://raw.githack.com/minoryorg/Noto-Sans-CJK-JP/master/fonts/NotoSansCJKjp-Medium.ttf');

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
		await page.waitForSelector("#ogp_image")
		const ogpComponent = await page.$("#ogp_image")
		
		if (ogpComponent == null) {
			throw new Error("ogp component is not shown")
		}

    result = await ogpComponent.screenshot({fullPage: false, type: "png", encoding: 'base64'})

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
