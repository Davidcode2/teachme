---
title: Teachly app architecture
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

    Container(webfe, "Single Page App", "React", $descr="Web UI", $link="https://github.com/davidcode2/teachme/fe")


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

The component diagram looks like a mess. I wonder whether a messy architecture
diagram equals a messy architecture or if this could be okay as it is.

```plantuml
@startuml

!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

Container_Boundary(boundary, "Web API") {

  together {
    Component(userController, "Users Controller", $descr="GET, POST, PATCH")
    Component(materialController, "Materials Controller", $descr="GET, POST, DELETE")
    Component(cartController, "Carts Controller", $descr="GET, POST, DELETE")
    Component(consumerController, "Consumers Controller", $descr="GET, POST, DELETE")
    Component(authorController, "Author Controller", $descr="GET, POST, DELETE")
    Component(authController, "Auth Controller", $descr="GET, POST, DELETE")
    Component(stripeController, "Stripe Controller", $descr="GET, POST, DELETE")
  }

  together {
    Component(materialService, "Materials Service", $descr="")
    Component(cartService, "Carts Service", $descr="")
    Component(userService, "Users Service", $descr="")
    Component(stripeService, "Stripe Service", $descr="")
  }

  Component(commonCartService, "Common Carts Service", $descr="")
  Component(consumerService, "Consumers Service", $descr="")
  Component(authService, "Auth Service", $descr="")
  Component(authorService, "Author Service", $descr="")
  Component(imageService, "Image Service", $descr="")
  Component(configService, "Config Service", $descr="")
  Component(materialFinderService, "Material PriceId Finder Service", $descr="")

}

ContainerDb(database, "Database", "Postgres", $descr="Database for storing material references, users, carts, etc.", $link="https://github.com/davidcode2/teachme")

Container_Ext(stripe, "Stripe API")

cartController --> cartService

materialController --> materialService
materialService --> imageService
materialService -> userService
materialService -> stripeService

userController --> userService
userService --> consumerService
userService --> authorService

cartService --> stripeService
cartService --> userService
cartService --> materialService
cartService --> commonCartService


stripeController --> stripeService
stripeService --> configService
stripeService --> userService
stripeService --> materialFinderService
stripeService --> commonCartService
stripeService -> stripe

consumerController --> consumerService
authorController --> authorService
authController --> authService

@enduml
```

**Code**
