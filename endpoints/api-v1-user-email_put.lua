--#ENDPOINT PUT /api/v1/user/{email}
-- luacheck: globals request response (magic variables from Murano)
local ret = User.createUser({
	email = request.parameters.email,
	name = request.parameters.email,
	password = request.body.password
})
if ret.status_code ~= nil then
	response.code = ret.status_code
	response.message = ret.message
else
	local domain = string.gsub(request.uri, 'https?://(.-/)(.*)', '%1')
	local text = "Hi " .. request.parameters.email .. ",\n"
	text = text .. "Click this link to verify your account:\n"
	text = text .. "https://" .. domain .. "/api/v1/user/verify/" .. ret;
	Email.send({
		from = 'Sample App <mail@exosite.com>',
		to = request.parameters.email,
		subject = ("Signup on " .. domain),
		text = text
	})
end

-- vim: set ai sw=4 ts=4 :
