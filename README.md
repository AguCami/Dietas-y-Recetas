# Dietas y Recetas

App para resolver la pregunta de todos los días: **¿qué cocinamos con lo que hay en casa?**, sin salirse
del Protocolo Autoinmune (PAI / AIP).

Cargás lo que tenés en la despensa y la app ordena el recetario por cuánto te falta para cada plato.
No esconde nada: muestra todas las recetas, con lo que tenés, lo que falta y con qué podés reemplazar
cada ingrediente que no consigas.

## Cómo está pensada

**El protocolo no está clavado en el código.** Cada ingrediente lleva etiquetas (solanácea, cereal,
lácteo, huevo…) y el *perfil* decide qué grupos se excluyen y qué excepciones puntuales hay. Por eso
el perfil arranca con PAI estricto pero con **huevo** y **trigo sarraceno** permitidos: son
reintroducciones. Cuando se reintroduce algo nuevo, se toca la pantalla **Plan** y listo — no hace
falta tocar el código ni reescribir recetas.

> ⚠️ El perfil por defecto es un punto de partida, no una indicación médica. La lista que vale es la de
> la nutricionista.

**Cada receta sugiere reemplazos.** Hay dos niveles: las alternativas propias de la receta (conocen el
contexto: no es lo mismo cambiar el zapallo en un puré que en una tarta) y una tabla de equivalencias
genéricas en `src/datos/sustituciones.ts`. Si tenés un reemplazo válido en casa, el ingrediente cuenta
como cubierto.

**Las sugerencias miran la hora.** A la mañana propone desayuno, al mediodía almuerzo, a la tarde
merienda y a la noche cena. La llamita es solo la mascota: no anuncia la hora, únicamente cambia lo que
recomienda.

## Estructura

```
src/
  datos/           el recetario y el catálogo: lo que más se va a editar
    ingredientes.ts    catálogo con etiquetas por grupo de alimento
    recetas.ts         recetas, con alternativas por ingrediente
    sustituciones.ts   equivalencias genéricas
    perfilBase.ts      el protocolo por defecto
  dominio/         la lógica, sin nada de React
    perfil.ts          decide si un ingrediente entra en el plan
    match.ts           cruza despensa × recetas × perfil
    horario.ts         franjas del día
  pantallas/       Inicio, Despensa, Recetas, Receta, Plan
  almacenamiento/  persistencia (hoy, el navegador)
```

## Para trabajar

```bash
npm install
npm run dev       # desarrollo
npm run validar   # chequea que el recetario sea consistente
npm run build     # compila para producción
```

`npm run validar` revisa que ningún ingrediente ni alternativa apunte a un id que no existe, que no
haya recetas duplicadas y que todo el recetario base sea apto para el perfil por defecto. **Corrélo
después de tocar los datos**: un id mal escrito no rompe nada visible, simplemente deja de cruzar con
la despensa.

### Agregar una receta

En `src/datos/recetas.ts`, copiando una existente. Los ids de ingredientes salen de
`src/datos/ingredientes.ts`. Si falta un ingrediente, agregalo primero al catálogo con sus etiquetas
(son las que determinan si queda dentro o fuera del protocolo). Después, `npm run validar`.

## Publicación

Se publica sola en GitHub Pages con cada push, vía `.github/workflows/deploy.yml`.

Para que funcione la primera vez hay que habilitarlo una sola vez:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

Queda en `https://agucami.github.io/Dietas-y-Recetas/`.

## Datos

Todo se guarda en el navegador del dispositivo (la despensa, el perfil y las favoritas). No hay
servidor ni cuentas: GitHub Pages es un sitio estático. Eso significa que **lo que cargás en un
celular no se ve en el otro**.

Si más adelante quieren sincronizar entre los dos, la persistencia está detrás de la interfaz
`Almacen` (`src/almacenamiento/tipos.ts`): se escribe un adaptador nuevo contra un backend y se cambia
una sola línea en `src/almacenamiento/index.ts`. Ninguna pantalla se entera.
