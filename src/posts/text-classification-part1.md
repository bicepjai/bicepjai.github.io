---
title: 'Deep (Survey) Text Classification Part 1'
date: '2017-11-10'
categories: ['machine-learning']
description: 'A survey of neural network models for text classification including CNN and RNN architectures with Keras code examples.'
---

Natural Language Processing (NLP) tasks, such as part-of-speech tagging, chunking, named entity recognition, and text classification, have been subject to a tremendous amount of research over the last few decades. Text Classification has been the most competed NLP task in Kaggle and other similar competitions. Count based models are being phased out, while new deep learning models are emerging almost every week. This project surveys a range of neural based models for text classification task.

Models explored in this post:

1. CNN for Sentence Classification
2. DCNN for Modeling Sentences
3. VDNN for Text Classification
4. Multi Channel Variable size CNN
5. Multi Group Norm Constraint CNN
6. RACNN Neural Networks for Text Classification

Let's dive right in to it.

---

## CNN for Sentence Classification

[Yoon et al (2014)](https://arxiv.org/abs/1408.5882) proposed CNN models in addition to pre-trained word vectors, which achieved excellent results on multiple benchmarks. The model architecture maintains multiple channels of input such as different types of pre-trained vectors or vectors that are kept static during training. Then they are convolved with different kernels/filters to create sets of features that are then max pooled.

The paper presents several variants of the model:

1. CNN-rand (a baseline model with randomly initialized word vectors)
2. CNN-static (model with pre-trained word vectors)
3. CNN-non-static (same as above but pre-trained fine tuned)
4. CNN-multichannel (model with 2 sets of word vectors)

Keras code for the model:

```python
text_seq_input = Input(shape=(MAX_TEXT_LEN,), dtype='int32')
text_embedding = Embedding(vocab_size, WORD_EMB_SIZE, input_length=MAX_TEXT_LEN,
                            weights=[trained_embeddings], trainable=True)(text_seq_input)

filter_sizes = [3,4,5]
convs = []
for filter_size in filter_sizes:
    l_conv = Conv1D(filters=128, kernel_size=filter_size, padding='same', activation='relu')(text_embedding)
    l_pool = MaxPool1D(filter_size)(l_conv)
    convs.append(l_pool)

l_merge = Concatenate(axis=1)(convs)
l_cov1= Conv1D(128, 5, activation='relu')(l_merge)
l_pool1 = MaxPool1D(100)(l_cov1)
l_flat = Flatten()(l_pool1)
l_dense = Dense(128, activation='relu')(l_flat)
l_out = Dense(9, activation='softmax')(l_dense)
model_1 = Model(inputs=[text_seq_input], outputs=l_out)
```

---

## DCNN for Modeling Sentences

[Kalchbrenner et al (2014)](https://arxiv.org/abs/1404.2188) presented Dynamic Convolutional Neural Network for semantic modeling of sentences. This model handles sentences of varying length and uses dynamic k-max pooling over linear sequences. K-max pooling, different from local max pooling, outputs k-max values from the necessary dimension of the previous convolutional layer.

The model also has a folding layer which sums over every two rows in the feature-map component wise. Wide convolutions are preferred for the model instead of narrow convolutions.

Keras code for the model:

```python
model_1 = Sequential([
    Embedding(vocab_size, WORD_EMB_SIZE, weights=[trained_embeddings],
              input_length=MAX_TEXT_LEN,trainable=True),
    ZeroPadding1D((49,49)),
    Conv1D(64, 50, padding="same"),
    KMaxPooling(k=5, axis=1),
    Activation("relu"),
    ZeroPadding1D((24,24)),
    Conv1D(64, 25, padding="same"),
    Folding(),
    KMaxPooling(k=5, axis=1),
    Activation("relu"),
    Flatten(),
    Dense(9, activation="softmax")
])
```

---

## VDNN for Text Classification

[Conneau et al (2016)](https://arxiv.org/abs/1606.01781) presented Very Deep CNN, which operates directly at the character level. This model also shows that deeper models perform better and are able to learn hierarchical representations of whole sentences.

The overall architecture contains multiple sequential convolutional blocks. The two design rules followed are:

1. For the same output temporal resolution, the layers have the same number of feature maps
2. When the temporal resolution is halved, the number of feature maps are doubled

Characters used: `abcdefghijklmnopqrstuvwxyz0123456789-,;.!?:'"/| #$%ˆ&*˜'+=<>()[]{}$`

Keras code:

```python
model_1 = Sequential([
    Embedding(global_utils.CHAR_ALPHABETS_LEN, CHAR_EMB_SIZE, weights=[char_embeddings],
               input_length=MAX_CHAR_IN_SENT_LEN, trainable=True),
    Conv1D(64, 3, padding="valid")
])

# 4 pairs of convolution blocks followed by pooling
for filter_size in [64, 128, 256, 512]:
    for cb_i in [0,1]:
        model_1.add(Conv1D(filter_size, 3, padding="same"))
        model_1.add(BatchNormalization())
        model_1.add(Activation("relu"))
        model_1.add(Conv1D(filter_size, 3, padding="same")),
        model_1.add(BatchNormalization())
        model_1.add(Activation("relu"))

    model_1.add(MaxPooling1D(pool_size=2, strides=3))

model_1.add(Flatten())
model_1.add(Dense(4096, activation="relu"))
model_1.add(Dense(2048, activation="relu"))
model_1.add(Dense(2048, activation="relu"))
model_1.add(Dense(9, activation="softmax"))
```

---

## Multi Channel Variable size CNN

[Yin et al (2016)](https://arxiv.org/abs/1603.04513) propose MV-CNN, which combines diverse versions of pre-trained word embeddings and extract features from multi-granular phrases with variable-size convolutions. Using multiple embeddings of the same dimension from different sets of word vectors should contain more information that can be leveraged during training.

```python
text_seq_input = Input(shape=(MAX_SENT_LEN,), dtype='int32')
text_embedding1 = Embedding(vocab_size, WORD_EMB_SIZE, input_length=MAX_SENT_LEN,
                            weights=[trained_embeddings1], trainable=True)(text_seq_input)
text_embedding2 = Embedding(vocab_size, WORD_EMB_SIZE, input_length=MAX_SENT_LEN,
                            weights=[trained_embeddings2], trainable=True)(text_seq_input)

k_top = 4
filter_sizes = [3,5]

layer_1 = []
for text_embedding in [text_embedding1, text_embedding2]:
    conv_pools = []
    for filter_size in filter_sizes:
        l_zero = ZeroPadding1D((filter_size-1,filter_size-1))(text_embedding)
        l_conv = Conv1D(filters=128, kernel_size=filter_size, padding='same', activation='tanh')(l_zero)
        l_pool = KMaxPooling(k=30, axis=1)(l_conv)
        conv_pools.append((filter_size,l_pool))
    layer_1.append(conv_pools)

last_layer = []
for layer in layer_1:
    for (filter_size, input_feature_maps) in layer:
        l_zero = ZeroPadding1D((filter_size-1,filter_size-1))(input_feature_maps)
        l_conv = Conv1D(filters=128, kernel_size=filter_size, padding='same', activation='tanh')(l_zero)
        l_pool = KMaxPooling(k=k_top, axis=1)(l_conv)
        last_layer.append(l_pool)

l_merge = Concatenate(axis=1)(last_layer)
l_flat = Flatten()(l_merge)
l_dense = Dense(128, activation='relu')(l_flat)
l_out = Dense(9, activation='softmax')(l_dense)
model_1 = Model(inputs=[text_seq_input], outputs=l_out)
```

---

## Multi Group Norm Constraint CNN

[Ye Zhang et al (2016)](https://arxiv.org/abs/1603.00968) proposed MG(NC)-CNN and captures multiple features from multiple sets of embeddings that are concatenated at the penultimate layer.

```python
text_seq_input = Input(shape=(MAX_SENT_LEN,), dtype='int32')
text_embedding1 = Embedding(vocab_size, WORD_EMB_SIZE1, input_length=MAX_SENT_LEN,
                            weights=[trained_embeddings1], trainable=True)(text_seq_input)
text_embedding2 = Embedding(vocab_size, WORD_EMB_SIZE2, input_length=MAX_SENT_LEN,
                            weights=[trained_embeddings2], trainable=True)(text_seq_input)
text_embedding3 = Embedding(vocab_size, WORD_EMB_SIZE3, input_length=MAX_SENT_LEN,
                            weights=[trained_embeddings3], trainable=True)(text_seq_input)

k_top = 4
filter_sizes = [3,5]

conv_pools = []
for text_embedding in [text_embedding1, text_embedding2, text_embedding3]:
    for filter_size in filter_sizes:
        l_zero = ZeroPadding1D((filter_size-1,filter_size-1))(text_embedding)
        l_conv = Conv1D(filters=16, kernel_size=filter_size, padding='same', activation='tanh')(l_zero)
        l_pool = GlobalMaxPool1D()(l_conv)
        conv_pools.append(l_pool)

l_merge = Concatenate(axis=1)(conv_pools)
l_dense = Dense(128, activation='relu', kernel_regularizer=l2(0.01))(l_merge)
l_out = Dense(9, activation='softmax')(l_dense)
model_1 = Model(inputs=[text_seq_input], outputs=l_out)
```

---

## RACNN Neural Networks for Text Classification

[Ye Zhang et al](https://arxiv.org/abs/1605.04469) presents RA-CNN model that jointly exploits labels on documents and their constituent sentences. The model tries to estimate the probability that a given sentence is rationales and then scale the contribution of each sentence to aggregate a document representation in proportion to the estimates.

RA-CNN has 2 stages in training: sentence level training and document level training.

---

## Other Models and Study on CNN methods

[Ye Zhang et al (2016)](https://arxiv.org/pdf/1510.03820.pdf) derives practical advice for getting the most out of CNN models:

1. Start with non-static word vectors rather than one-hot vector
2. Coarse line search over single filter region in range 1~10
3. Alter the number of feature maps from 100 to 600
4. Try relu and tanh activations
5. Use 1-max pooling
6. When increasing feature maps, try increasing regularization
7. Cross validation must be performed

---

We have looked at some of the state of the art neural models for text classification. In the next part lets look at some of the RNN models used effectively for text classification.
