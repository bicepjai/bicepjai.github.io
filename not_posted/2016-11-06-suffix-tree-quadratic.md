---
layout: post
type: blog
comments: true
title: Suffix Tree Quadratic Algorithm
date: 2016-11-06
categories: algorithms
---

The task was simple, create suffix tree from scratch using a simple quadratic algorithm. I under estimated the task and it took 13.5 hours of my busy week. When i was looking around for hints, i could not find a proper explanation on this topic but could find algorithms explanation for harder linear time algorithms. So i thought lets help easing the task for future quadratic-suffix-tree algorithm enthusiasts.

Ok read up on [TRIE](https://en.wikipedia.org/wiki/Trie) before moving on. There are awful lot of interesting and good materials online about this algorithm. Google is your friend here. Then read up on [SUFFIX TREE](https://en.wikipedia.org/wiki/Suffix_tree) enough to understand that the task is to build a (suffix) tree, tree made up suffixes. Hope you know what suffix is ?

Ok, I think by now you should know this task involves building a tree that has nodes and edges; there is always a root node; there is this special character (say \\$) you have to use to define the ending of string (figure out why); then nodes are the one decides which edge to branch to; leaf nodes always has the incoming branch with string containing character \$; the edges are the structures that really has the string in it.

Cool, I am not gonna explain all that, there are so many books and videos that explain them well. I am sure algo enthusiasts would have known [this](https://visualgo.net/suffixtree) site, but still check out the impressive visualization on suffix tree.

Lets get into the algorithm itself. This code builds the suffix tree using quadratic algorithm, totally not the one used in applications but its fun to figure it out and its a pretty interesting task if you have not done this before. For instance the suffixes of string "PANAMABANANAS$"

|P|A|N|A|M|A|B|A|N|A|N|A|S|$|
|A|N|A|M|A|B|A|N|A|N|A|S|$|
|N|A|M|A|B|A|N|A|N|A|S|$|
|A|M|A|B|A|N|A|N|A|S|$|
|M|A|B|A|N|A|N|A|S|$|
|A|B|A|N|A|N|A|S|$|
|B|A|N|A|N|A|S|$|
|A|N|A|N|A|S|$|
|N|A|N|A|S|$|
|A|N|A|S|$|
|N|A|S|$|
|A|S|$|
|S|$|
|$|


We are going to storing the string on the edges in a very efficient way as a pair starting index and length of the string on the edge. Remember there is only one string and we are trying to build a tree from its suffixes. Here we are assuming the string is gonna contain just 4 characters, easily extended for many the characters.
This code is in java and lets start building stuff.

Lets create an Edge class that will hold the strings
which the next viable node that can be branched into

``` java
// Edges are objects that holds a string; Long strings occupies more memory
// we are trying to reduce the memory foot print to a constant amount that does not
// depend on the string size. Since we are considering only the suffixes of the same
// string using the start and end, one should be able to get the sub string. Another
// important variable it holds is a node index which is the node that can be reached
// using this edge, this can be Node.NA/-1 which implies, no more nodes can be reached
class Edge {
   public int start_i;
   public int length;
   public int next_node_i;

   Edge() {
      start_i = -1;
      length = -1;
      next_node_i = -1;
   }

   public String toString() {
      return "(" + start_i + ", " + length + ", " + next_node_i + ")";
   }
}
```

Lets create an Node class that will hold all the viable edges through which the next node can be reached

``` java

// Node class represents the point of branching where a decision is made which
// edge to consider for next branch/step/traversal in identifying the necessary
// next part of the string
class Node {

   // each node contains a pointer which is set based on its creation]
   // these are used for traversals and identifications
   public int sftree_i;

   // We are considering only 5 strings including the end character
   // to make the code and example easy to decipher, each node will have
   // only `Letters` number of edges which means, the next character can be
   // only one of ACGT$ . We can extent this easily to any number of
   // characters involved with using one unique character for end character
   // where we use $
   public static final int Letters =  5;
   // a reference to say the branch doesn't contain any further pointers to nodes
   public static final int NA      = -1;

   // Look at Edge class for explanation.
   // there will be `Letters` number of edges
   public Edge[] edges;

   // constructor that takes the node index as input; also set the
   // edges Edge.next_node_i pointer to NA meaning there is no more nodes to
   // move/branch to from here
   Node (int sftree_i) {
      this.sftree_i = sftree_i;
      edges = new Edge [Letters];
      for (int i = 0; i < Letters; i++) {
         edges[i] = new Edge();
      }
   }

   // this method is used to decide if we have reached the end node
   // this is assessed based on whether all the Edges in the
   // edges array contains Node.NA for the next branching
   public boolean isLeaf () {
      if ( (this.edges[0].next_node_i == Node.NA &&
            this.edges[1].next_node_i == Node.NA &&
            this.edges[2].next_node_i == Node.NA &&
            this.edges[3].next_node_i == Node.NA &&
            this.edges[4].next_node_i == Node.NA)) {
         return true;
      } else {
         return false;
      }
   }

   // this is a helper method that can be used to set the node
   // as a leaf node. used to reduce code clutter
   public void makeLeaf () {
      this.edges[0].next_node_i = Node.NA;
      this.edges[1].next_node_i = Node.NA;
      this.edges[2].next_node_i = Node.NA;
      this.edges[3].next_node_i = Node.NA;
      this.edges[4].next_node_i = Node.NA;
   }

   public String toString() {
      return "Node: " + this.sftree_i + " leaf: " + this.isLeaf()
             + ",(" + this.edges[0].start_i + "," + this.edges[0].length + ")" + this.edges[0].next_node_i
             + ",(" + this.edges[1].start_i + "," + this.edges[1].length + ")" + this.edges[1].next_node_i
             + ",(" + this.edges[2].start_i + "," + this.edges[2].length + ")" + this.edges[2].next_node_i
             + ",(" + this.edges[3].start_i + "," + this.edges[3].length + ")" + this.edges[3].next_node_i
             + ",(" + this.edges[4].start_i + "," + this.edges[4].length + ")" + this.edges[4].next_node_i
             + "";
   }
}
```
As we notice in the code, the strings are represented as start index and length, since we are dealing with just
one string. For comparing these substrings of the string we need a special method which takes care of corner cases.

``` java
   // function that returns mismatch position between 2 sub strings of the string
   // since we are dealing with suffixes we provide the main string and the 2 substrings
   // start and end position.
   public static int return_mismatch_length(String text, int s1, int l1, int s2, int l2) {
      int s1_i = s1;
      int s2_i = s2;
      int l = 0;

      // while loop quits when any of the 2 length conditions are met
      // meaning when there are no more characters to compare
      while (l <= l1 && l <= l2) {

         // if there are mismatches then we return the position
         if (text.charAt(s1_i) != text.charAt(s2_i)) {
            return l;
         }
         l++;
         s1_i++; s2_i++;
      }
      // corner cases
      // when any of the length is 1 and then
      // just consider the one matching character
      if (l1 == 1 || l2 == 1) {
         if (text.charAt(s1) != text.charAt(s2)) {
            return 0;
         } else {
            return 1;
         }
      }

      // after the above conditions check, if the lengths are same
      // then there are no mismatched characters, same substring
      if(l1 == l2)
         return -1;

      // matched and adjusted index
      return l-1;
   }
```
Now lets take a look at the main function that builds the suffix tree. Debug statements
are all commented out, but these help in viewing the process of building the tree in gory details.

``` java
   // forming the sftree
   public static Map<Integer, Node> formSuffixTree (String text) {

      // for faster access of the nodes by their index, we create a hash table
      Map<Integer, Node> sftree = new HashMap<Integer, Node>();

      // to track number of nodes in the suffix tree, also just performing
      // one increment by 1 gives index for new node
      int sftree_size = 0;
      // to prevent calling text_length all the time
      int text_length = text.length();

      // at the start, we have only 2 nodes
      // root node index 0
      // first leaf node index 1
      Node root = new Node(sftree_size);
      sftree.put(sftree_size, root);
      sftree_size++;

      Node first_tail_node = new Node(sftree_size);
      sftree.put(sftree_size, first_tail_node);
      sftree_size++;

      // we put the whole string in the edge
      // we choose the edge that represents the character which is the starting
      // character of the string
      root.edges[letterToIndex(text.charAt(0))].next_node_i = first_tail_node.sftree_i;
      root.edges[letterToIndex(text.charAt(0))].start_i = 0;
      root.edges[letterToIndex(text.charAt(0))].length = text_length;

      // System.out.println("================== " + text + " ==================");
      // System.out.println(sftree.get(0));
      // System.out.println(sftree.get(1));

      // we are traversing the string from last to first in the reverse order
      for (int s_i = text_length - 1; s_i >= 1 ; s_i--) {
         // you can check the difference on what happens if we move forward from start to end
         // i used the reverse since it was easy for me to visualize
         // for (int s_i = 1 ; s_i < text.length() ; s_i++) {

         // all the variables with _s means its start index
         // all the variables with _l means its length
         // the following variable holds the suffix substring
         int suffix_s = s_i;
         int suffix_l = text_length - s_i;

         // to prevent the usage of letterToIndex, charAt methods and edge index access, the
         // following variables are introduced
         Character suffix_s_sym     = text.charAt(suffix_s);
         int       suffix_s_acgt_i  = letterToIndex(suffix_s_sym);

         // String    suffix      = getTextSubString(text, suffix_s, suffix_l);
         // System.out.println("-for---" + s_i + "-------------" + suffix + "-----------" + suffix_s + "," + suffix_l + "------");

         // since we are going to iterate thru the suffix to figure out
         // if it exists and if so how to branch and rearrange existing edges and nodes
         // if not, insert a new branch

         // the following variables are used to denote the current node in the traversal
         // since we are going to traverse through the tree from the root to leaves,
         // to keep track of the current node in the main while loop
         // always start from the index 0 which is root node
         int  cur_node_i = 0;
         Node cur_node   = sftree.get(cur_node_i);

         // while loop traverse through the existing tree
         // when starting its just 2 nodes, one root node and another leaf node
         // connected with an edge of full string

         // loop breaks out when leaf node is reached which means a suffix has been completed
         // traversed from its starting character to the ending character
         while (!cur_node.isLeaf()) {

            // System.out.println("--while------------");
            // System.out.println("--TREE--" + text);
            // print(sftree, text);
            // System.out.println("--TREE--");

            // get current node index
            // current node will be set based on processing
            // System.out.println("cur_node");
            // System.out.println(cur_node);

            // getting edge branch string details based on suffix start symbol
            // to prevent the usage of edge array index access, the
            // following variables are introduced
            int       cur_edge_s       = cur_node.edges[suffix_s_acgt_i].start_i;
            int       cur_edge_l       = cur_node.edges[suffix_s_acgt_i].length;

            // System.out.println("suffix_s,l: " + suffix_s + ", " + suffix_l + " : " + getTextSubString(text, suffix_s, suffix_l));
            // System.out.println("cur_edge_s,l: " + cur_edge_s + ", " + cur_edge_l);

            // get the next node index from the current node edge pointers
            int next_node_i = cur_node.edges[suffix_s_acgt_i].next_node_i;

            // node already exists
            // if cur_node matching suffix start
            // symbol indexes into cur_node.edges array and its not NA
            if (next_node_i != Node.NA) {
               Node next_node = sftree.get(next_node_i);

               // System.out.println("next_node");
               // System.out.println(next_node);

               // String    edge_string = getTextSubString(text, cur_edge_s, cur_edge_l);
               // System.out.println("suffix_start_sym: " + suffix_s_sym + " suffix_s_acgt_i: " + suffix_s_acgt_i);
               // System.out.println("found edge string: " + edge_string);

               // check for suffix match in the edge_string
               // custom pattern comparison function
               int mismatch_l = return_mismatch_length(text, suffix_s, suffix_l, cur_edge_s, cur_edge_l);

               // System.out.println("mismatch_l: " + mismatch_l + " cur_edge_l: " + cur_edge_l + " comparing " + suffix + " <> " + edge_string);

               if (mismatch_l == -1) { // matches
                  // suffix exist in the suffix tree already
                  // move on to processing the next suffix
                  // System.out.println("edge_string == suffix ( " + suffix + " )");
                  cur_node = next_node;
                  continue;
               } else {
                  // when mismatch happens and the edge_string
                  // has all the matched characters in the suffix
                  // we set the cur_node_i to the next pointer from the next_node edges
                  // and continue

                  // lets form new suffix thats leftover
                  // new variables to be clear
                  int new_suffix_s = suffix_s + mismatch_l;
                  int new_suffix_l = suffix_l - mismatch_l;
                  // System.out.println("new_suffix_s: " + new_suffix_s + " new_suffix_l: " + new_suffix_l);

                  // String new_suffix = getTextSubString(text, new_suffix_s, new_suffix_l);
                  // System.out.println("new suffix that needs to be processed " + new_suffix);

                  // condition where all the edge string part matches suffix and
                  // suffix still has some text left
                  if (mismatch_l >= cur_edge_l) {

                     // setting suffix back to same variable used at the start of while loop
                     suffix_s = new_suffix_s;
                     suffix_l = new_suffix_l;

                     // avoiding long method access
                     int new_suffix_s_sym_acgt_i = letterToIndex(text.charAt(new_suffix_s));
                     int viable_path_next_node_i = next_node.edges[new_suffix_s_sym_acgt_i].next_node_i;

                     // checking if the next node arrived at with new suffix start symbol
                     // has a valid path to move one
                     // if there is a valid path to move on, we hitch the ride on this
                     // new node, set that to be the current node and move on to the start of while loop
                     if (viable_path_next_node_i != Node.NA) {
                        // System.out.println("found viable path to continue " + viable_path_next_node_i);
                        cur_node = next_node;
                     } else {
                        // if we dont get a ride in the node, this means this part of the string doesn't
                        // exist in the tree, hence we create a new suffix edge and a new leaf node

                        // System.out.println("no viable path found, so creating a new node");

                        //                                  new_suffix
                        //           top_edge_str        /---------------- new_node
                        // cur_node -------------- next_node
                        //                               \---------------- exist
                        //

                        // remaining part in the suffix forms new edge
                        // dealing with valid new_suffix (suffix with non 0 length)
                        if (new_suffix_l > 0) {

                           // System.out.println("new_suffix_only_node");

                           Node new_node = new Node(sftree_size);
                           sftree.put(sftree_size, new_node);
                           sftree_size++;

                           // update next_node next array indices
                           next_node.edges[new_suffix_s_sym_acgt_i].next_node_i = new_node.sftree_i;
                           next_node.edges[new_suffix_s_sym_acgt_i].start_i = new_suffix_s;
                           next_node.edges[new_suffix_s_sym_acgt_i].length = new_suffix_l;

                           cur_node = new_node;
                        }
                     }
                     continue;
                  }
                  // at this point there are more texts to be traversed
                  // and but the edge string matches only some, we need to handle
                  // conditions where the edge string has to be broken up and new nodes needs to be
                  // introduced

                  // since we might corrupt next node edges
                  // back up next node edges
                  Edge [] next_node_edges = new Edge [Node.Letters];
                  for (int i = 0; i < Node.Letters; i++) {
                     next_node_edges[i] = new Edge();
                     next_node_edges[i].next_node_i = next_node.edges[i].next_node_i;
                     next_node_edges[i].start_i = next_node.edges[i].start_i;
                     next_node_edges[i].length = next_node.edges[i].length;
                  }

                  // the portion matched is same in both suffix and the
                  // edge_string, set current node edge string as the matched portion
                  cur_node.edges[suffix_s_acgt_i].start_i = cur_edge_s;
                  cur_node.edges[suffix_s_acgt_i].length = mismatch_l;

                  // System.out.println("cur_edge_s: " + cur_node.edges[suffix_s_acgt_i].start_i + " cur_edge_l: " + cur_node.edges[suffix_s_acgt_i].length);
                  // System.out.println("cur_edge_str: " + getTextSubString(text, cur_node.edges[suffix_s_acgt_i].start_i, cur_node.edges[suffix_s_acgt_i].length));

                  // new_suffix start and length already calculated
                  // here we get the part left out of the current edge
                  int new_edge_s = cur_edge_s + mismatch_l;
                  int new_edge_l = cur_edge_l - mismatch_l;

                  // System.out.println("new_edge_s: " + new_edge_s + " new_edge_l: " + new_edge_l);

                  // remaining part in both the suffix and edge_string
                  // forms 2 new branches from the next_node
                  // String new_suffix_edge_str = getTextSubString(text, new_suffix_s, new_suffix_l);
                  // String new_edge_str = getTextSubString(text, new_edge_s, new_edge_l);
                  // System.out.println("new_suffix_edge_str:" + new_suffix_edge_str);
                  // System.out.println("new_edge_str:" + new_edge_str);

                  //                                  new_suffix_bottom1_edge_str
                  //           top_edge_str        /----------------------- new_suffix_bottom1_node
                  // cur_node -------------- next_node
                  //                               \----------------------- new_bottom2_node
                  //                                  new_bottom2_edge_str

                  // making next_node leaf node meaning they are getting cleared
                  // since its getting updated anyways
                  next_node.makeLeaf();

                  // dealing with new_suffix_edge_str
                  if (new_suffix_l > 0) {
                     // get the starting symbol index from new suffix
                     int new_suffix_acgt_i = letterToIndex(text.charAt(new_suffix_s));

                     Node new_suffix_leaf_node = new Node(sftree_size);
                     sftree.put(sftree_size, new_suffix_leaf_node);
                     sftree_size++;

                     // update next_node edge to point to new suffix edge ending with a tail node
                     next_node.edges[new_suffix_acgt_i].next_node_i = new_suffix_leaf_node.sftree_i;
                     next_node.edges[new_suffix_acgt_i].start_i = new_suffix_s;
                     next_node.edges[new_suffix_acgt_i].length = new_suffix_l;

                     // System.out.println("new_suffix_leaf_node");
                     // System.out.println(new_suffix_leaf_node);

                  }

                  // dealing with non suffix new_edge_str, left over from the current
                  // edge string in process, this might not be a leaf node
                  if (new_edge_l > 0) {
                     // get the starting symbol index from new edge
                     int new_edge_acgt_i = letterToIndex(text.charAt(new_edge_s));

                     Node new_edge_node = new Node(sftree_size);
                     sftree.put(sftree_size, new_edge_node);
                     sftree_size++;

                     // hooking up the next_node edges and then updating the new edge
                     // addition, we do this os that we do not loose any links present
                     // before
                     for (int i = 0; i < Node.Letters; i++) {
                        new_edge_node.edges[i].next_node_i = next_node_edges[i].next_node_i;
                        new_edge_node.edges[i].start_i = next_node_edges[i].start_i;
                        new_edge_node.edges[i].length = next_node_edges[i].length;
                     }

                     next_node.edges[new_edge_acgt_i].next_node_i = new_edge_node.sftree_i;
                     next_node.edges[new_edge_acgt_i].start_i = new_edge_s;
                     next_node.edges[new_edge_acgt_i].length = new_edge_l;

                     // System.out.println("new_edge_node");
                     // System.out.println(new_edge_node);
                  }

                  // reached a node where branching was necessary and hence terminate
                  // and deal with new suffix
                  break;
               }
            }
            // node doesn't exist if node.next index is -1
            // add the suffix and move on to the next suffix
            else {
               // if there is no edge to new suffix_start_symbol
               // we create a new node and add it to the sftree
               // making edge by putting the new node index in the cur_node_i next array
               // also adding the suffix to the edge_string
               // System.out.println("pattern doesnt exists adding new leaf node");
               Node new_node = new Node(sftree_size);
               sftree.put(sftree_size, new_node);
               int new_node_added_i = sftree_size;
               sftree_size++;

               cur_node.edges[suffix_s_acgt_i].next_node_i = new_node_added_i;
               cur_node.edges[suffix_s_acgt_i].start_i     = suffix_s;
               cur_node.edges[suffix_s_acgt_i].length      = suffix_l;

               cur_node = new_node;
               break;
            }
         } // end while

         // print(sftree, text);
      }
      return sftree;
   }
```

Let me know if you have any questions regarding the code and the procedure, this code has been stress tested and also passed against the server hosting the verification of the code. The code can be downloaded [here](https://github.com/bicepjai/myclasses/tree/master/2017/ucsd-dsa/4-string-algo/week1/suffix_tree).
