/**
 * AI平台浏览器端 TypeScript 客户端 (v2.0)
 *
 * 签名规则：
 * 1、将accessKeyId、accessKeySecret、timestamp、params的前512个字符串，拼接起来，得到待签名数据
 * 2、将待签名数据，根据signtype的值，使用对应的Hmac算法（使用accessKeySecret作为密钥）进行签名
 * 3、将签名后的信息使用Base64进行转换，得到签名结果
 */

// 支持的签名类型
export type SignType = 'MD5' | 'SHA1' | 'SHA224' | 'SHA256' | 'SHA384' | 'SHA512'

/**
 * 将 ArrayBuffer 转换为 Base64 字符串
 * @param buffer ArrayBuffer
 * @returns string Base64 编码的字符串
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer)
	let binary = ''
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i])
	}
	return btoa(binary)
}

/**
 * 使用 Web Crypto API 进行 HMAC 签名
 * @param secretKey 密钥
 * @param data 待签名数据
 * @param algorithm 签名算法
 * @returns Promise<ArrayBuffer> 签名结果
 */
async function hmacSign(secretKey: string, data: string, algorithm: string): Promise<ArrayBuffer> {
	const encoder = new TextEncoder()
	const keyData = encoder.encode(secretKey)
	const messageData = encoder.encode(data)
	console.log('algorithm', algorithm)
	// 根据算法名称获取对应的 Web Crypto API 算法标识
	let cryptoAlgorithm: string
	switch (algorithm.toUpperCase()) {
		case 'MD5':
			// Web Crypto API 不支持 MD5，需要使用第三方库或 polyfill
			throw new Error('MD5 is not supported by Web Crypto API. Please use SHA1, SHA256, SHA384, or SHA512.')
		case 'SHA1':
			cryptoAlgorithm = 'SHA-1'
			break
		case 'SHA224':
			cryptoAlgorithm = 'SHA-224'
			break
		case 'SHA256':
			cryptoAlgorithm = 'SHA-256'
			break
		case 'SHA384':
			cryptoAlgorithm = 'SHA-384'
			break
		case 'SHA512':
			cryptoAlgorithm = 'SHA-512'
			break
		default:
			throw new Error(`Unsupported sign type: ${algorithm}`)
	}

	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		keyData,
		{
			name: 'HMAC',
			hash: cryptoAlgorithm,
		},
		false,
		['sign'],
	)

	return await crypto.subtle.sign('HMAC', cryptoKey, messageData)
}

/**
 * 生成签名
 * @param signType 签名类型，支持 SHA1，SHA224，SHA256，SHA384，SHA512（注意：浏览器端不支持 MD5）
 * @param accessKeyId 平台提供的 accessKeyId，用于标示用户
 * @param accessKeySecret 平台提供的 accessKeySecret，密钥
 * @param timestamp 当前时间戳
 * @param params 请求参数（JSON 字符串），就是base64编码后的图片
 * @returns Promise<string> Base64 编码的签名结果
 */

export default async function getSign(signType: SignType, accessKeyId: string, accessKeySecret: string, timestamp: string, params: string): Promise<string> {
	console.log('getSign params', params);
	// 取 params 的前 512 个字符
	const paramsPrefix = params.substring(0, 64)

	// 拼接待签名数据
	const signedData = `${accessKeyId}${accessKeySecret}${timestamp}${paramsPrefix}`

	// 使用 HMAC 算法进行签名
	const hmacData = await hmacSign(accessKeySecret, signedData, signType)
	console.log('hmacData', arrayBufferToBase64(hmacData));
	// 将签名结果转换为 Base64
	return arrayBufferToBase64(hmacData)
}
// 测试代码示例
getSign('SHA1', 'testAccessKeyId', 'testAccessKeySecret', '1627890123456', 'i9j/4AAQSkZJRgABAQEAAAAAAAD/4QAuRXhpZgAATU0AKgAAAAgAAkAAAAMAAAABAGEAAEABAAEAAAABAAAAAAA')