# bubbles

Bubbles are Data Containers

- Every user has a set of **bubbles**.
- Each bubble is a sort of **folders of data**
- Bubbles can be **shared**, **public** or **private**

## Thought process
- User owns the data
- When I use an application, I tell what bubbles to use
- Each bubble is an identity

## Use case
- I have a TODO list app and I want to switch to an awesome one. With bubbles, instead of rewriting every TODO, I can just link my bubble to the new one
- Enrico is a doctor and he has a software for managing his patients and a software for doing a medical special treatment. With bubbles, he can plug his "Patients" bubble in both, to have the data syncronized and linked
- Nicola wants to find what is the best cycle path to do today. With bubbles, he logs into amazingcyclepath.com by connecting his "Health" bubble, without providing any further information.
- The microwave wants to know what is in the fridge. With bubbles, the microwave checks in the fridge bubbles, what is there.

## The outcomes

In essence, we achieve:
- data **portability**
- data **interoperability**
- **separation between data and applications**
- user has **control** on its data

## History

This idea was in my mind, from back in 2012.
I wanted to make a new web made of these containers of data, where users could just plug their data **as their identity** when logging in into websites. I implemented a version that was based on RESTful apis, and everything was centralized.

I slowly got to understand that such system would only work if data in a bubble is **standardized**, so that data from a bubbles could be read from different applications. The power of bubbles is just here: **decoupling applications from data**.

It was clear that at that stage, I should have not made a centalized system, where users can host their bubbles wherever they want. I am now at MIT working on Solid/Linked Data Platform - which is in essence a very similar concept. The next step, however, it is not in the standardization of the data or a decentralized protocol for sharing data, but a p2p system for which data do not need to pass through the Internet.

## Notes on the current implementation

I will implement bubbles with [`solid`](https://github.com/linkeddata/solid) and eventually [`webrtc`](http://www.webrtc.org/) and [`ipfs`](http://ipfs.io/)

## Adventurers

I am looking for new adventurers, feel free to [ping me](http://twitter.com/nicolagreco) or PR me
