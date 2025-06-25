#version 440

in vec2 TexCoord;
in vec4 fragPos;
in vec3 vNormals;
out vec4 FragColor;

uniform sampler2D colorTexture; // base texture (albedo/diffuse)
uniform sampler2D aoMap;// Ambient Occlusion (black = shadown)
uniform vec3 mainLight;	//light position
uniform vec3 fillLight; // 2nd light (fill)
uniform vec3 backLight; // 3rd light (back)
uniform float ka;		//environment light
uniform float kd;		//difuse light
uniform vec3 viewPos;   // camera position (world space)
uniform float ks;       // specular factor (ex: 0.2)
uniform float shininess;// brightness exponent (ex: 32.0)

void main()
{
	vec3 lightColor = vec3(1.0f, 0.957f, 0.898f); // main light color (warm)
    vec3 lightColorFill = vec3(0.7f, 0.7f, 0.8f); // fill light (cooler, bluish)
    vec3 lightColorBack = vec3(1.0f, 1.0f, 1.0f); // back light (neutral white)

    vec3 baseColor = texture(colorTexture, TexCoord).rgb;
    float ao = texture(aoMap, TexCoord).r; // use only R channel

    vec3 N = normalize(vNormals);
    vec3 V = normalize(viewPos - vec3(fragPos));

    // --- Ambient lighting ---
    vec3 ambient = ka * (lightColor + lightColorFill + lightColorBack) / 3.0;

    // --- Main light ---
    vec3 L_main = normalize(mainLight - vec3(fragPos));
    vec3 diffuseMain = kd * max(dot(L_main, N), 0.0f) * lightColor;
    vec3 R_main = reflect(-L_main, N);
    float specMain = pow(max(dot(V, R_main), 0.0), shininess);
    vec3 specularMain = ks * specMain * lightColor;

    // --- Fill light ---
    vec3 L_fill = normalize(fillLight - vec3(fragPos));
    vec3 diffuseFill = kd * max(dot(L_fill, N), 0.0f) * lightColorFill;
    vec3 R_fill = reflect(-L_fill, N);
    float specFill = pow(max(dot(V, R_fill), 0.0), shininess);
    vec3 specularFill = ks * specFill * lightColorFill;

    // --- Back light ---
    vec3 L_back = normalize(backLight - vec3(fragPos));
    vec3 diffuseBack = kd * max(dot(L_back, N), 0.0f) * lightColorBack;
    vec3 R_back = reflect(-L_back, N);
    float specBack = pow(max(dot(V, R_back), 0.0), shininess);
    vec3 specularBack = ks * specBack * lightColorBack;

    vec3 finalColor = (ambient + 
                       diffuseMain + specularMain +
                       diffuseFill + specularFill +
                       diffuseBack + specularBack) * baseColor * ao;

    FragColor = vec4(finalColor, 1.0);
}
