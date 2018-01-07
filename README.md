# Bienvenido

Este modulo es el encargado de proporcionar el conector para trabajar con
[Elastic Search][elasticsearch].

> solo se soporta la versión 5.6.x

## Instalación

```bash
yarn add @zerointermittency/elastic
# npm i --save @zerointermittency/elastic
```

## Errores estandarizados

code | level | name             | message
-----|-------|------------------|------------------
100  |fatal  |internal          |Internal error
101  |error  |validate          |Validate error
102  |fatal  |unsuportedVersion |Unsuported version
103  |error  |notFound          |Not Found

## Api

El modulo utiliza npm **[elasticsearch][npm-elasticsearch]**, para poder utilizar todas las funcionalidades que están descritas en su [documentación][docs-elasticsearch].

##### Iniciar

Se instancia un objeto como se hace a continuación:

```javascript
const ZIElastic = require('@zerointermittency/elastic'),
    elastic = new ZIElastic(opts);
```

**Argumentos**:

- opts \(*Object*\) **required**: este objeto recibe todas las opciones para levantar la conexión a nuestra instancia de **[Elastic Search][elasticsearch]**, para mayor información todas las opciones están documentadas [aquí][settings-connection-elasticsearch]
    - apiVersion: indica la versión soportada **solo se soporta la versión 5.6.x**

**Retorna**:

- \(*ZIElastic*\): Retorna la instancia de la clase **ZIElastic**.


#### Atributo **client**

Una vez se instancia un objeto **ZIElastic** se puede llamar a través de **client** cualquier funcionalidad desde la [API de Elastic Search][api-elasticsearch], como por ejemplo:

```javascript
elastic.client.bulk([params, [callback]]);
```

> bulk esta documentado [aquí][bulk-elasticseach]

##### Método **_checkVersion**

Tiene como objetivo validar que la versión de [Elastic Search][elasticsearch] esta soportada

ejemplo:

```javascript
elastic._checkVersion()
    .then(() => {})
    .catch((error) => {});
```

**Retorna**:

- \(*Promise*\):
    - then(): se ejecuta si la versión de [Elastic Search][elasticsearch] es soportada
    - catch(error \[*Object*\]): error estandarizado basado en [npm-error][npm-error]
        - Errores estandarizados (unsuportedVersion, internal)

##### Método **search**

Realiza la búsqueda de un termino entre todos los **indice:tipo** que tenga registrado, para poder entregar un resultado por cada uno (como lo realiza el buscador de spotify).

ejemplo:

```javascript
elastic.search(term, opts)
    .then((result) => {})
    .catch((error) => {});
```

**Argumentos**:

- term \(*String*\) **required**: palabra a buscar entre todos los **indice:tipo**
- opts \(*Object*\):
    - items \(*Number*\): determina la cantidad de elementos que se devuelven por cada **indice:tipo**, por defecto: **10**
    - language \(*String*\): determina si la búsqueda tiene un lenguaje en especifico, por defecto: **original**
    - client \(*String*\): contiene el identificador del cliente al que pertenece el contenido para poder filtrar los **indice:tipo**
    - appgroup \(*String*\): contiene el identificador del grupo de aplicaciones al que pertenece el contenido para poder filtrar los **indice:tipo**
    - apps \(*Array\[String\]*\): contiene el arreglo de aplicaciones dentro de las cuales puede pertenecer el contenido para poder filtrar los **indice:tipo**
    - accessgroups \(*Array\[String\]*\): contiene el arreglo de los grupos de acceso en los cuales puede pertenecer el contenido para poder filtrar los **indice:tipo**
    - _bodybuilder \(*Object*\): donde cada llave identifica el **indice:tipo** y en el valor una función que recibe el **[bodybuilder][bodybuilder]**, que es quien genera la consulta a [Elastic Search][elasticsearch] permitiendo agregar filtros u ordenar los resultados
    - operator \(*String*)\: determina de que manera se evalúan las frases escritas al buscar, por defecto **and**
        - and: indica que se busque coincidencia el conjunto de palabras unidas
        - or: indica que se busque coincidencia por separado o unidas
    - fuzziness \(*String*)\: determina el numero de faltas ortográficas que son permitidas al escribir las palabras, por defecto **2**

**Retorna**:

- \(*Promise*\):
    - then(\[*Object*\])
        - items \(*Array[Object]*\): listado de elementos encontrados
        - sections \(*Array[Object]*\):
            - title \(*Object*\): titulo en distintos idiomas para desplegar en los resultados de la búsqueda
            - index \(*Number*\): indice del listado de elementos, desde el cual comienzan los contenidos de la sección
            - extra \(*Object*\):
                - time \(*Number*\): tiempo en segundos que identifica cuanto se demoro la búsqueda para los contenidos de la sección
                - searchable \(*String*\): identifica a que objeto **indice:tipo** pertenecen los elementos de la sección
    - catch(error \[*Object*\]): error estandarizado basado en [npm-error][npm-error]
        - Errores estandarizados (internal)

##### Método **searchable**

Registra el **indice:tipo** sobre el cual realizar una búsqueda con una determinada estructura, como por ejemplo:

```javascript
// const searchable = elastic.searchable(opts),
const searchable = elastic.searchable({
    index: 'test',
    type: 'test',
    displayName: {original: 'Test', es: 'Prueba'},
    deepLink: '/test/{{_id}}',
    attrs: {
        nameAttribute: {type: 'String', analyzer: 'standard'},
    },
});
```

**Argumentos**:

- opts \(*Object*\):
    - index \(*String*\) **required**: nombre para el indice de búsqueda, sobre el cual realizara sus operaciones el objeto
    - type \(*String*\) **required**: cada elemento que contiene [Elastic Search][elasticsearch] necesita tener tanto un indice como un tipo para poder realizar las distintas operaciones de búsqueda, creación, eliminación y actualización
    - displayName \(*Object*\) **required**: este atributo permite generar las secciones por lenguaje al momento de realizar busquedas
    - deepLink \(*String*\): tal como dice su nombre es para generar el enlace de cada elemento, por defecto es ```/typeInLowerCase/{{_id}}``` (siempre debe contener {{_id}}, ya que esto se reemplaza por el identificador unido del elemento)
    - attrs \(*Object*\) **required**: objeto con las propiedades que se genera el **[mapping][mapping-elasticsearch]** para el **indice:tipo** en [Elastic Search][elasticsearch]. (mas información sobre las opciones que puede tener cada atributo en la sección **iniciar de Searchable** mas abajo)

**Retorna**:

- \(*Searchable*\): Retorna el objeto para realizar las operaciones y consultas por **indice:tipo**

## Searchable

Esta clase es para manipular los **indice:tipo**, la cual nos genera el **[mapping][mapping-elasticsearch]** que **[Elastic Search][elasticsearch]** requiere para poder construir los elementos identificando sobre que atributos de los elementos realizar una búsqueda.

> Esta clase es invocada en el **Método searchable** de la instancia de **ZIElastic**

**Estructura estándar**:

Para que la búsqueda sea estándar, todos los elementos tienen una estructura base que los identifica y que contiene los elementos para despegarlos sin tener problemas en la falta de información entre ellos.

```javascript
{
    __id: {type: 'string', index: 'not_analyzed'},
    __client: {type: 'string', index: 'not_analyzed'},
    __appgroup: {type: 'string', index: 'not_analyzed'},
    __apps: {type: 'string', index: 'not_analyzed'},
    __accessgroups: {type: 'string', index: 'not_analyzed'},
    title: {
        properties: {
            original: {type: 'string', index: 'not_analyzed'},
            es: {type: 'string', index: 'not_analyzed'},
            en: {type: 'string', index: 'not_analyzed'},
            pt: {type: 'string', index: 'not_analyzed'},
            zh: {type: 'string', index: 'not_analyzed'},
            de: {type: 'string', index: 'not_analyzed'},
            fr: {type: 'string', index: 'not_analyzed'},
            it: {type: 'string', index: 'not_analyzed'},
        },
    },
    description: {
        properties: {
            original: {type: 'string', index: 'not_analyzed'},
            es: {type: 'string', index: 'not_analyzed'},
            en: {type: 'string', index: 'not_analyzed'},
            pt: {type: 'string', index: 'not_analyzed'},
            zh: {type: 'string', index: 'not_analyzed'},
            de: {type: 'string', index: 'not_analyzed'},
            fr: {type: 'string', index: 'not_analyzed'},
            it: {type: 'string', index: 'not_analyzed'},
        },
    },
    deepLink: {type: 'string', index: 'not_analyzed'},
    images: {
        properties: {
            _id: {type: 'string', index: 'not_analyzed'},
            type: {type: 'string', index: 'not_analyzed'},
            default: {type: 'boolean', index: 'not_analyzed'},
        },
    },
    videos: {
        properties: {
            _id: {type: 'string', index: 'not_analyzed'},
            name: {
                properties: {
                    original: {type: 'string', index: 'not_analyzed'},
                    es: {type: 'string', index: 'not_analyzed'},
                    en: {type: 'string', index: 'not_analyzed'},
                    pt: {type: 'string', index: 'not_analyzed'},
                    zh: {type: 'string', index: 'not_analyzed'},
                    de: {type: 'string', index: 'not_analyzed'},
                    fr: {type: 'string', index: 'not_analyzed'},
                    it: {type: 'string', index: 'not_analyzed'},
                },
            },
            weight: {type: 'integer', index: 'not_analyzed'},
        },
    },
    searchable: {type: 'string', index: 'not_analyzed'},
    displayName: {
        properties: {
            original: {type: 'string', index: 'not_analyzed'},
            es: {type: 'string', index: 'not_analyzed'},
            en: {type: 'string', index: 'not_analyzed'},
            pt: {type: 'string', index: 'not_analyzed'},
            zh: {type: 'string', index: 'not_analyzed'},
            de: {type: 'string', index: 'not_analyzed'},
            fr: {type: 'string', index: 'not_analyzed'},
            it: {type: 'string', index: 'not_analyzed'},
        },
    },
    from: {type: 'date', format: formatDate, index: 'not_analyzed'},
    innerObject: {
        // dinamic attributes for searchable
    },
}
```

> todos los atributos con la opción **index: 'not_analyzed'**, no son indexados para no sobre cargar el indexado de [Elastic Search][elasticsearch], ya que son utilizados para visualizar o filtrar.

- **__id**: identifica el elemento en [Elastic Search][elasticsearch]
- **__client**: atributo que contiene el **cliente** para poder ser filtrado al momento de realizar la búsqueda
- **__appgroup**: atributo que contiene el **grupo de aplicaciones** para poder ser filtrado al momento de realizar la busqueda
- **__apps**: atributo que contiene las **aplicaciones** para poder ser filtrado al momento de realizar la búsqueda
- **__accessgroups**: atributo que contiene los **grupos de acceso** para poder ser filtrado al momento de realizar la búsqueda
- **title**: titulo en los distintos idiomas que este disponible
- **description**: descripción en los distintos idiomas que este disponible
- **deepLink**: enlace con el cual pueden hacer la llamada en las aplicaciones al detalle del contenido
- **imagenes**: listado de imágenes para poder mostrar en los resultados
- **videos**: listado de videos para poder mostrar el resultado
- **searchable**: identifica a que objeto **indice:tipo** pertenece el elemento
- **displayName**: es el nombre para el titulo de la sección de los resultados por **indice:tipo**
- **from**: indica la fecha desde la cual esta disponible el contenido
- **innerObject**: contiene al objeto completo del **indice:tipo** correspondiente

##### Iniciar

Se instancia un objeto como se hace a continuación:

```javascript
const Searchable = require('./lib/Searchable'),
    searchable = new Searchable(opts, client);

// esto es lo que hace internamente el método searchable de una instancia de ZIElastic
```

**Argumentos**:

- opts \(*Object*\):
    - index \(*String*\) **required**: nombre para el indice de búsqueda, sobre el cual realizara sus operaciones el objeto
    - type \(*String*\) **required**: cada elemento que contiene [Elastic Search][elasticsearch] necesita tener tanto un indice como un tipo para poder realizar las distintas operaciones de búsqueda, creación, eliminación y actualización
    - displayName \(*Object*\) **required**: este atributo permite generar las secciones por lenguaje al momento de obtener el resultado de una búsqueda
    - deepLink \(*String*\): enlace de cada elemento, por defecto es ```/tipoEnLowerCase/{{_id}}``` (siempre debe contener {{_id}}, ya que esto se reemplaza por el identificador unido del elemento)
    - attrs \(*Object*\) **required**: objeto con las propiedades que se genera el **[mapping][mapping-elasticsearch]** para el **indice:tipo** en [Elastic Search][elasticsearch].
- client \(*elasticsearch.Client*\): ya que esta clase es utilizada dentro del Método **searchable** de ZIElastic y para poder manipular el **indice:tipo** a del **client** de [Elastic Search][elasticsearch]

**Opciones para los atributos en attrs**:

- type \(*String*\): indica el tipo de elemento que sera registrado en [Elastic Search][elasticsearch], entre los cuales hay los siguientes:
    - **String**: tanto para palabras como textos
    - **Date**: para fechas
    - **Boolean**: para atributos boleanos
    - **Long**: números enteros
    - **Float**: números flotantes
    - **Available (Custom)**: debe si o si tener la estructura un objeto ```{from: Date, until: (Date || undefined)}```
    - **LocalizableString (Custom)**: debe si o si tener un objeto con al menos la llave **original** con el texto correspondiente
- common \(*String*\): permite identificar los atributos que todo elementos registrado en [Elastic Search][elasticsearch] puede contener para la estructura estándar que hemos definido anteriormente (**__id, title, description, images, videos, __client, __appgroup, __apps, __accessgroups, from**)
- analyzer: \(*String*\): identifica que ese atributo sera analizado y el valor indica el tipo de búsqueda aplicada, [tipos de búsqueda][analyzer]

**Retorna**:

- \(*ZIElastic*\): Retorna la instancia de la clase **ZIElastic**.

#### Atributo **mapping**

Este atributo contiene todo el **[mapping][mapping-elasticsearch]** que [Elastic Search][elasticsearch] requiere al momento de registrar un **indice:tipo**, para mayor detalle revisar [documentación][mapping-elasticsearch]

#### Método **_build**

Este Método tiene como objetivo convertir un objeto al formato estandarizado para dicho **indice:tipo**

> su enfoque es para poder traspasar la información que se guarde en la base de datos mongo ([@zerointermittency/mongo][zi-mongo]) y que a partir de esa estructura se construya a como debe quedar guardado en [Elastic Search][elasticsearch]

```javascript
const builObj = searchable._build(obj);
```

#### Método **search**

Realiza la búsqueda de un termino en el **indice:tipo** del objeto searchable.

ejemplo:

```javascript
searchable.search(term, opts)
    .then((result) => {})
    .catch((err) => {});
```

**Argumentos**:

- term \(*String*\) **required**: palabra a buscar entre en el **indice:tipo**
- opts \(*Object*\) **required**:
    - page \(*Number*\): determina la pagina de los resultados encontrados, por defecto: **1**
    - itemsPerPage \(*Number*\): determina la cantidad de elementos por pagina, por defecto: **10**
    - language \(*String*\): determina si la búsqueda tiene un lenguaje en especifico, por defecto: **original**
    - client \(*String*\): contiene el identificador del cliente al que pertenece el contenido para poder filtrar
    - appgroup \(*String*\): contiene el identificador del grupo de aplicaciones al que pertenece el contenido
    - apps \(*Array\[String\]*\): contiene el arreglo de aplicaciones dentro de las cuales puede pertenecer el contenido
    - accessgroups \(*Array\[String\]*\): contiene el arreglo de los grupos de acceso en los cuales puede pertenecer el contenido
    - _bodybuilder \(*Function*\): recibe el **[bodybuilder][bodybuilder]**, que es quien genera la consulta a [Elastic Search][elasticsearch] permitiendo agregar filtros u ordenar los resultados

**Retorna**:

- \(*Promise*\):
    - then(\[*Object*\])
        - items \(*Array[Object]*\): listado de elementos encontrados
        - paginate \(*Object*\):
            - page \(*Number*\): numero de pagina
            - offset \(*Number*\): numero de elementos que se fueron saltados
            - total \(*Number*\): total de resultados
            - itemsPerPage \(*Number*\): elementos por pagina
            - pages \(*Number*\): numero de paginas
    - catch(error \[*Object*\]): error estandarizado basado en [npm-error][npm-error]
        - Errores estandarizados (internal)

#### Método **crud.create**

Crear un nuevo elemento en [Elastic Search][elasticsearch] en el **indice:tipo** del objeto searchable:

```javascript
searchable.crud.create(obj)
    .then((result) => {})
    .catch((err) => {});
```

create es un wrapper de la funcionalidad [create del API de Elastic Search][create-elasticsearch], donde internamente se inicia el **indice:tipo** y se aplica el Método **_build** sobre el objeto para insertarlo en el formato estandarizado

**Retorna**:

- \(*Promise*\):
    - then(result \[*Object*\]): entrega el resultado igual que [create del API de Elastic Search][create-elasticsearch]
    - catch(error \[*Object*\]): error estandarizado basado en [npm-error][npm-error]
        - Errores estandarizados (internal)

#### Método **crud.read**

Detalle de un documento

```javascript
searchable.crud.read(_id)
    .then((result) => {})
    .catch((err) => {});
```

read es un wrapper de la funcionalidad [get del API de Elastic Search][get-elasticsearch]

**Retorna**:

- \(*Promise*\):
    - then(result \[*Object*\]): entrega el resultado igual que [get del API de Elastic Search][get-elasticsearch]
    - catch(error \[*Object*\]): error estandarizado basado en [npm-error][npm-error]
        - Errores estandarizados (notFound, internal)

#### Método **crud.update**

Actualizar un documento:

```javascript
searchable.crud.update(obj)
    .then((result) => {})
    .catch((err) => {});
```

update es un wrapper de la funcionalidad [update del API de Elastic Search][update-elasticsearch], al igual que create internamente se inicia el **indice:tipo** y se aplica el Método **_build** sobre el objeto para actualizarlo en el formato estandarizado

**Retorna**:

- \(*Promise*\):
    - then(result \[*Object*\]): entrega el resultado igual que [update del API de Elastic Search][update-elasticsearch]
    - catch(error \[*Object*\]): error estandarizado basado en [npm-error][npm-error]
        - Errores estandarizados (notFound, internal)

#### Método **crud.delete**

Eliminar un elemento:

```javascript
searchable.crud.delete(_id)
    .then((result) => {})
    .catch((err) => {});
```

delete es un wrapper de la funcionalidad [delete del API de Elastic Search][delete-elasticsearch]

**Retorna**:

- \(*Promise*\):
    - then(result \[*Object*\]): entrega el resultado igual que [delete del API de Elastic Search][delete-elasticsearch]
    - catch(error \[*Object*\]): error estandarizado basado en [npm-error][npm-error]
        - Errores estandarizados (notFound, internal)

## Pruebas funcionales (Unit Testing)

Se llevaron a cabo las pruebas funcionales para validar el funcionamiento de sus Métodos y opciones por defecto:

```bash
$ yarn test
```

## Changelog

Todos los cambios importantes son escritos aquí. El Formato esta basado en [Keep a Changelog](http://keepachangelog.com/es-ES/1.0.0/)

### [Unreleased]

### [1.0.0] - 2018-01-07
#### Added
- Se agregan pruebas funcionales con el objetivo de tener probado todo el código, usando [istanbul js][istanbul] para saber cuanto
- Creación de un objeto (**Searchable**) que permita realizar operaciones crud en [elasticsearch][elasticsearch]
- Manipulación de indices y tipos para las búsquedas
- Método de búsqueda en todos los tipos he indices registrados, dividiendo en secciones cada resultado y ordenando según el puntaje que le asigna [Elastic Search][elasticsearch] a las búsquedas
- Método de búsqueda por un tipo especifico (paginado)
- README.md instalación, pruebas, uso y como contribuir al proyecto

[elasticsearch]: https://www.elastic.co
[npm-elasticsearch]: https://www.npmjs.com/package/elasticsearch
[docs-elasticsearch]: https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html
[settings-connection-elasticsearch]: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/configuration.html#config-options
[api-elasticsearch]: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html
[bulk-elasticseach]: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-bulk
[bodybuilder]: http://bodybuilder.js.org/docs/#bodybuilder
[analyzer]: https://www.elastic.co/guide/en/elasticsearch/reference/5.5/analysis-analyzers.html
[create-elasticsearch]: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create
[get-elasticsearch]: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-get
[update-elasticsearch]: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-update
[delete-elasticsearch]: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-delete
[mapping-elasticsearch]: https://www.elastic.co/guide/en/elasticsearch/guide/master/mapping-intro.html
[zi-mongo]: https://www.npmjs.com/package/@zerointermittency/mongo
[istanbul]: https://istanbul.js.org/