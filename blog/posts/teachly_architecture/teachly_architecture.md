---
title: Teachly.store architecture
date: 2025-03-22
tags: post
layout: post-layout.njk
---

In the following I want to document the architecture of the teachly.store
project. I'll use the C4 diagrams to get an understanding of how everything fits 
together.

**Context**

```plantuml
@startuml

!include  https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(personAlias, "User", "Teacher or Refendar")
System(systemAlias, "Teachly")
System_Ext(paymentProvider, "Payment Provider")

personAlias ..> systemAlias : browse
personAlias ..> systemAlias : upload
personAlias ..> systemAlias : buy
systemAlias -> paymentProvider : handle payment

@enduml
```

**Containers**

```plantuml
@startuml

!include  https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(person, "User", "Teacher or Refendar")

System_Boundary(boundary, "Teachly System", $link="https://github.com/davidcode2/teachme") {

    Container(webapi, "Web API", "Nest.js", $descr="Provides API for uploading, searching and buying materials", $link="https://github.com/davidcode2/teachme/be")

    Container(webfe, "Web Frontend", "React", $descr="Web UI", $link="https://github.com/davidcode2/teachme/fe")


together {
    Container(reverse_proxy, "Reverse Proxy", "Nginx", $descr="Reverse proxy for terminating SSL", $link="https://github.com/davidcode2/teachme/reverse_proxy")

    Container(idp, "Identity Provider", "Keycloak", $descr="Identity provider for authentication and authorization", $link="https://github.com/davidcode2/teachme/keycloak")
}

    ContainerDb(database, "Database", "Postgres", $descr="Database for storing material references, users, carts, etc.", $link="https://github.com/davidcode2/teachme")

    ContainerDb(file_store, "File storage", "Docker volume", $descr="Folder storing materials (PDF), previews and thumbnails (PNG)", $link="https://github.com/davidcode2/teachme")

}

Container_Ext(paymentProvider, "Payment provider", "Stripe", $descr="Payment provider handling payments", $link="https://github.com/davidcode2/teachme/be")

person --> webfe
webfe -> idp
webfe --> reverse_proxy
reverse_proxy --> webapi
webapi -u-> idp
webapi -l-> database
webapi -> paymentProvider
webapi --> file_store

@enduml
```

**Components**

**Code**


