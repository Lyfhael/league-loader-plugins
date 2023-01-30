from flask import Flask, jsonify, request, make_response
import requests, os, openai, asyncio, json
from chronological import read_prompt, cleaned_completion, append_prompt
from flask_cors import CORS

response = openai.Completion.create(model="text-davinci-003", prompt="Say this is a test", temperature=0, max_tokens=7)
available_personalities = ["ariane"]
context = {}

app = Flask(__name__)
cors = CORS(app, resources={
	r"/davinci": {
		"origins": ["*"]
	},
})

async def rebuild_message(message, personality):
	message = request.headers.get("message")
	message += f"\n\n{personality}:"
	return message

async def build_context(id, message, personality):
	global context

	if id not in context:
		context[id] = read_prompt(f'{personality}_lobby')
	print("HERE: ",type(context[id]), context[id])
	print("HERE2:", type(message), message)
	context[id] += message

async def check_parameters(id, personality, message):
	if personality not in available_personalities:
		return "invalid personality"
	if len(id) == 0:
		return "invalid id"
	if len(message) == 0:
		return "invalid message"
	return "valid"

@app.route("/davinci", methods=["POST"])
async def davinci():
	global context

	id = request.headers.get("id")
	personality = request.headers.get("personality")
	message = request.headers.get("message").lower()

	check = await check_parameters(id, personality, message)
	if check != "valid":
		return make_response([check], 400)

	message = await rebuild_message(message, personality)
	await build_context(id, message, personality)
	completion = await cleaned_completion(context[id], max_tokens=60, engine="text-davinci-003", temperature=0.9, top_p=1, presence_penalty=0.6, stop=["\n"])
	context[id] += f"{completion}\n\n"
	print(completion)
	print("ID:",id)
	return make_response([completion], 200)

if __name__ == "__main__":
    app.run()
