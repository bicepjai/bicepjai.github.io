---
layout: post
type: blog
comments: true
title: Clustering using Kruskal's Spanning Algorithm
date: 2017-01-21
categories: algorithms
---

Clustering is a fundamental problem in data mining. The goal is to partition
a given set of objects into subsets (or clusters) in such a way that any two
objects from the same subset are close (or similar) to each other, while any
two objects from different subsets are far apart.

[Kruskal's Algorithm](https://en.wikipedia.org/wiki/Kruskal's_algorithm) is one of the famous greedy algorithm that creates a minimum spanning tree which has edges connecting nodes with least possible weight. It uses Union-Find Disjoint Data Structure similar to [Prim's Algorithm](https://en.wikipedia.org/wiki/Prim%27s_algorithm). Wikipedia has really good write up on them and you can look for numerous correctness proofs on youtube. The following gif is taken from wikipedia.

|![](https://upload.wikimedia.org/wikipedia/commons/5/5c/MST_kruskal_en.gif){: height="360px" width="320px"}|![](https://upload.wikimedia.org/wikipedia/commons/b/bb/KruskalDemo.gif)|

All my Machine learning classes always emphasis or allude to some of the following algorithms.
1. Connectivity based: $O(n^2)$ algorithms
2. Centroid related: K-means, etc
3. Neural Networks/Deep Learning: Autoencoders, etc
4. Density related: DBSCAN, etc
5. Probabilistic: LDA, etc
6. Dimensionality Reduction: PCA, 

During one of the assignment problems in class [Algorithms on Graphs](https://www.coursera.org/learn/algorithms-on-graphs) of specialization[Data Structures and Algorithms Specialization](https://www.coursera.org/specializations/data-structures-algorithms), i came across how to make clusters using kruskals algorithm and it was pretty interesting. 

You should already know how Kruskal's Algorithms works for you to understand this idea/code. The whole idea is a simple extension of the existing property of the algorithm. In the above gif taken from wikipedia, you can see how the distances are chosen based on the priority queue (prioritized on edge weights, in this code the weights are simple distance metric) before adding the edge to the minimum spanning tree. Here is the observation,

1. The last successful edge (n-1 th) added will be the edge connecting the 2 clusters
2. The last (n-1) and (n-2) edges added will be the edges connecting 3 clusters
3. and so on.

This is a direct consequence of shortest edge being considered for forming the spanning tree in the Kruskal's Algorithm. Lets look into some java code.

The following snippet shows code for Union Find Data structure. This uses path compression during find operation.

``` java
   // A class to represent a subset for union-find
   public static class UF {
      int[] parents;
      int[] ranks;

      UF(int n) {
         this.parents = new int[n];
         this.ranks = new int[n];

         // Create V sets with single elements
         for (int u = 0; u < n; ++u) {
            this.parents[u] = u;
            this.ranks[u] = 0;
         }
      }

      // Find set of an element i
      // (uses path compression technique)
      public int find(int i) {
         // find root and make root as parent of i (path compression)
         if (this.parents[i] != i)
            this.parents[i] = find(this.parents[i]);

         return this.parents[i];
      }

      // union of two sets of x and y
      // (uses union by rank)
      public void union(int x, int y) {
         int xroot = this.find(x);
         int yroot = this.find(y);

         // Attach smaller rank tree under root of high rank tree
         // (Union by Rank)
         if (this.ranks[xroot] < this.ranks[yroot])
            this.parents[xroot] = yroot;
         else if (this.ranks[xroot] > this.ranks[yroot])
            this.parents[yroot] = xroot;

         // If ranks are same, then make one as root and increment
         // its rank by one
         else {
            this.parents[yroot] = xroot;
            this.ranks[xroot]++;
         }
      }

   }
```

The following snippet shows the clustering algorithms that uses Kruskal's Algorithm, but takes an input parameter that selects how many clusters are required to be created. This is as simple as not allowing some edges at the end to be added. 

This algorithm computes the largest possible value of d such that the given points can be partitioned into $nof_clusters$ non-empty subsets in such a way that the distance between any two points from different subsets is at least $d$.

```java
   private static double clustering(int[] x, int[] y, int nof_clusters) {
      double result = 0.;
      int n = x.length;

      // priority queue the return all the edges by minimum distance
      PriorityQueue<Edge> edges =
      new PriorityQueue<Edge>(n, new Comparator<Edge>() {
         public int compare(Edge e1, Edge e2) {
            return (e1.distance > e2.distance ? 1 : -1);
         }
      });

      // forming edges
      for (int i = 0; i < n; i++) {
         for (int j = i; j < n; j++) {
            // avoid self loop
            if (i == j) {
               continue;
            }
            Edge e = new Edge(i, j);
            e.distance = Math.sqrt((x[i] - x[j]) * (x[i] - x[j]) + (y[i] - y[j]) * (y[i] - y[j]));
            edges.add(e);
         }
      }

      // Creating sets
      UF uf = new UF(n);

      // kruskals
      int i = 0;
      while (!edges.isEmpty()) {
         Edge e = edges.poll();
         int u_root = uf.find(e.u);
         int v_root = uf.find(e.v);
         if (u_root != v_root) {
            uf.union(e.u, e.v)
            // ------------ extra code required ------------------
            // n-1 edge is the shortest edge connecting 2 clusters
            // n-1 and n-2 edge are the shortest edges connecting 3 clusters
            // and so on
            if (i++ == n - nof_clusters) {
               result = e.distance;
            }
            // ---------------------------------------------------
         }
      }

      return result;
   }
```

Let me know if you have any questions regarding the code and the procedure, this code has been stress tested and also passed against the server hosting the verification of the code. The code can be downloaded [here](https://github.com/bicepjai/myclasses/tree/master/2016/ucsd-dsa/3-algos-on-graphs/week5/clustering).
