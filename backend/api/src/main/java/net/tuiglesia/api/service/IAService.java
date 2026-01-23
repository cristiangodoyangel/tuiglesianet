package net.tuiglesia.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class IAService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestClient restClient = RestClient.create();

    private static final String ESTILO_VISUAL = "Children's bible book illustration style, flat vector art, thick bold black outlines, vibrant and solid colors, minimal shading. Cute cartoon characters with large expressive round eyes and simple features. Clean and cheerful aesthetic, educational vibe.";

    public String generarConsejo(String peticion) {
        String prompt = "Actúa como un asistente pastoral experto. Responde de forma empática y teológica a: " + peticion;
        return llamarGemini(prompt);
    }

    public String generarPromptImagen(String descripcionEscena) {
        String prompt = String.format(
                "Act as an expert Prompt Engineer. I need to generate an image with this specific style: '%s'. " +
                        "Convert the following user request into a precise English image prompt applying that style. " +
                        "User request: '%s'. Output ONLY the raw English prompt, no other text.",
                ESTILO_VISUAL, descripcionEscena
        );
        return llamarGemini(prompt);
    }

    private String llamarGemini(String textoPrompt) {
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", textoPrompt)
                        ))
                )
        );

        String fullUrl = apiUrl + "?key=" + apiKey;

        try {
            Map response = restClient.post()
                    .uri(fullUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            // AGREGA ESTA LÍNEA:
            e.printStackTrace();
            return "Error procesando la solicitud con Gemini: " + e.getMessage();
        }
    }
}