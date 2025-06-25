#version 440

layout(location = 0) in vec3 position;
layout(location = 1) in vec2 texCoord;
layout(location = 2) in vec3 normals;

out vec2 TexCoord;
out vec3 vNormals;
out vec4 fragPos;

uniform mat4 model;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main()
{
	gl_Position = projectionMatrix * viewMatrix * model * vec4(position, 1.0);
	fragPos = model * vec4(position, 1.0);
	TexCoord = texCoord;
	vNormals = transpose(inverse(mat3(model))) * normals;
}