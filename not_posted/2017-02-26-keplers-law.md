---
layout: post
type: blog
comments: true
title: Kepler’s Laws of Planetary Motion using Calculus
date: 2017-02-26
categories: math
---
Data Science has been used for achieving scientific milestones even in 1500s. Nicolaus Copernicus put forth [laws of motion of planets](https://en.wikipedia.org/wiki/Kepler's_laws_of_planetary_motion) based on his observations and Johannes Kepler did better modeling and corrected them.
There are lot of proofs available online, this material is influenced by series of questions from the book [Calculus: Early Transcendental Functions](https://www.amazon.com/gp/product/1439047898/ref=oh_aui_search_detailpage?ie=UTF8&psc=1) from Exercise 12.5 from Chapter 12 Vector-Values Functions Section 12.5 Arc Length and Curvature.

Kepler's laws of planetary motion are

1. The orbit of a planet is an ellipse with the Sun at one of the two foci.
2. A line segment joining a planet and the Sun sweeps out equal areas during equal intervals of time.
3. The square of the orbital period of a planet is proportional to the cube of the semi-major axis of its orbit.

Lets try prove these simple looking laws using just calculus concepts. It is assumed the reader knows the following concepts

1. [Vector Valued Function](https://www.khanacademy.org/math/multivariable-calculus/thinking-about-multivariable-function#visualizing-vector-valued-functions)
2. [Dot Product](https://en.wikipedia.org/wiki/Dot_product) and [Cross Product](https://en.wikipedia.org/wiki/Cross_product)
3. [Tangent Planes and Normal Planes](https://www.khanacademy.org/math/multivariable-calculus/applications-of-multivariable-derivatives#tangent-planes-and-local-linearization)
4. [Arc Length and Curvature](https://www.khanacademy.org/math/multivariable-calculus/multivariable-derivatives#curvature)

Lets start.

Let $r(t)$ be the position vector of the planet at time t represented as

$r(t) = <x(t), y(t), z(t)>$

The distance value d that represents the distance of the planet from the Sun can be written as

$ d = \Vert r(t) \Vert = \sqrt{x^2(t) + y^2(t) + z^2(t)}$

The unit vector in the direction of the planet

$ \hat u = \frac{r(t)}{d}$

then the velocity vector that gives the direction and the velocity $v(t)$ is

$v(t) = \dot r(t) = <\dot x(t), \dot y(t), \dot z(t)>$

and the acceleration vector $a(t)$ is

$a(t) = \dot v(t) = \ddot r(t) = <\ddot x(t), \ddot y(t), \ddot z(t)>$

Kepler found out that the acceleration of the planet was toward the sun and 
Newton explained that in terms of gravitational force of the sun $F$ on the planet in the direction of the sun. Let's say

* $G$ represent the universal gravitational constant,
* $M$ represent the mass of the sun,
* $m$ represent the mass of the planet.

$ F = - \frac{G * M * m}{d^2} * \hat u$

[Newton’s Second Law of Motion](https://en.wikipedia.org/wiki/Newton's_laws_of_motion) says

$F = m * a(t)$

This implies

$m * a(t) = - \frac{G * M * m}{d^2} * \hat u $

$a(t) = - \frac{G * M}{d^3} * r(t) $

Now we can say $\vec a(t)$ which is same as $v(t)$ which is $\ddot r(t)$  paraller to $\vec r(t)$ since they are multiple of each other. Hence we can say

$ \ddot r(t)  \times r(t) = 0$

Lets consider the following derivative 

$ \begin{align}
\frac d{dt} (r(t) \times \dot r(t)) = \dot r(t) \times \dot r(t) + r(t) \times \ddot r(t) \\
& = 0 + 0 = 0\\
\end{align} $

Hence $r(t) \times \dot r(t)$ is a constant lets call it
$ L = r(t) \times \dot r(t) $



