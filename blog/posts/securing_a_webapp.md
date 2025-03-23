---
title: Securing a web app
date: 2025-03-23
tags: post
layout: post-layout.njk
---

Let's see how a user could potentially mess around with
my web app. We'll explore different attack vectors and 
see how we could mitigate them.


```plantuml
@startuml

!include  https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

!define osaPuml https://raw.githubusercontent.com/Crashedmind/PlantUML-opensecurityarchitecture2-icons/master
!include osaPuml/Common.puml
!include osaPuml/User/all.puml
!include osaPuml/Hardware/all.puml
!include osaPuml/Misc/all.puml
!include osaPuml/Server/all.puml
!include osaPuml/Site/all.puml

Person(bad_actor, "Jimmy", "Bad actor", $sprite="osa_user_black_hat")

System_Boundary(boundary, "Teachly System", $link="https://github.com/davidcode2/teachme") {
    Container(webapi, "Web API")
}

bad_actor -> webapi : access stuff without permission
bad_actor -> webapi : inject malicious stuff
bad_actor -> webapi : spam the endpoints
bad_actor -> webapi : write tons of stuff to my database

@enduml
```

