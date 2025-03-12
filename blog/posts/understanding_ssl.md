---
title: Understanding SSL
date: 2025-03-12
tags: post
layout: post-layout.njk
---

After learning about the SSL handshake in [Playing around with
UML](/posts/playing_around_with_architecture_diagrams/) I now want to answer a
few more questions to fill in the picture.

When a request is made from a client to a server, the client specifies which protocol
it wants to use. In the case of http, the client might specify that it wants to establish
an encrypted connection by using https.

When a https request is sent out, a handshake is carried out between the client
and the server. In essence, the client tells the server it would like to use an
encrypted connection. The server then offers its certificate. The client uses
the public key contained within the certificate to encrypt a pre-master key and
sends it to the server. The server can decrypt it and now both parties can use
this key (with some modifications - turning the pre-master key into a master
key) to encrypt their messages. Since both the client (it created it) and the
server (it has the private key to decrypt it) have the master key, they can
read each others messages. And the messages are encrypted while in transit. So
thats the part of the actual communication at a high level. 

Now what about the certificates that lay on the server? These are a mystery to me. There
are two of them. One of them may be called `fullchain` and the other `privkey`.
So thinking about this and recollecting what I have read, these should serve the following purposes:

- `fullchain` holds information which enables the client to verify the chain of
  trust (whatever that means)
- `privkey` will be the certificate which contains the private key. Then this
  would mean that this certificate will never leave the browser. If that is
  true, the `fullchain` certificate will also contain the public key. Since in
  my configuration there is no other certificate.

Let's check what we got so far.



Chain of trust:

![Chain of trust visualization](./250312-2131-chain_of_trust.png)

