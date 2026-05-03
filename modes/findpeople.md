# Modo: findpeople — Hiring Team Discovery

Utiliza este modo para identificar al Hiring Manager, Recruiter y posibles Referrals para una vacante específica.

## Instrucciones de Operación

1. **Resolver la Posición**: Identificar empresa, rol, vertical y ubicación (usar WebSearch o WebFetch si se proporciona una URL).
2. **Identificar Hiring Manager**:
   - Buscar líderes 1 o 2 niveles por encima del rol (Director/VP para roles mid-level).
   - Usar queries como `"[Company]" "[Function]" Head OR Director 2025 LinkedIn`.
   - Verificar que sigan en la empresa.
3. **Identificar Hiring HR**:
   - Buscar Talent Acquisition Partners o Recruiters internos, preferiblemente en la misma ciudad.
4. **Identificar Referral Candidates**:
   - Buscar personas en el **mismo rol** o equipo (peers).
5. **Triangulación**: Verificar contra al menos 2 fuentes independientes.

## Formato de Salida (ESTRICTO)

Entregar **únicamente** una tabla Markdown con estas 6 columnas:

| Name | LinkedIn Profile Link | Title | Confidence | Why | Role |

**Reglas de la tabla:**
- **Name**: Nombre completo.
- **LinkedIn Profile Link**: URL completa.
- **Title**: Título exacto actual.
- **Confidence**: High, Medium o Low.
- **Why**: 1-2 frases explicando por qué es el contacto correcto.
- **Role**: `Hiring Manager`, `Hiring HR` o `Referral`.

**Orden**: Hiring Manager (High->Low) > Hiring HR > Referral.
**Límite**: Máximo 9 filas total (3 por tipo).
**Prohibido**: No incluir preámbulos, explicaciones, fuentes o notas al pie. Solo la tabla.

## Confidence Rubric
- **HIGH**: 2+ fuentes recientes confirman título y empresa. Match de nivel claro.
- **MEDIUM**: Confirmado por 1 fuente fuerte, fit de rol inferido.
- **LOW**: Una sola fuente o datos > 24 meses. Explicar debilidad en "Why".

## Anti-patterns
- No scrapear LinkedIn directamente (usar snippets públicos de búsqueda).
- No incluir gente que ya se fue.
- No incluir CEO/CMO para roles junior/mid (son demasiado senior).
- No mostrar emails o teléfonos.
