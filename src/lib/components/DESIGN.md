# Component Architecture

This document describes the organization and relationships of UI components.

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                        +layout.svelte                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     MatrixRain                            │  │
│  │              (background canvas effect)                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     Navigation                            │  │
│  │         (nav bar with matrix toggle control)              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                        <slot/> (pages)                          │
│                              │                                  │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│    ┌─────────┐         ┌─────────┐         ┌─────────────┐      │
│    │  Home   │         │  About  │         │ Blog Post   │      │
│    │ (+page) │         │ (+page) │         │ ([slug])    │      │
│    └────┬────┘         └────┬────┘         └──────┬──────┘      │
│         │                   │                     │             │
│         ▼                   ▼                     ▼             │
│  ┌──────────────┐    ┌──────────────┐     ┌──────────────┐      │
│  │TerminalWindow│    │TerminalWindow│     │TerminalWindow│      │
│  │   ┌──────┐   │    │              │     │ ┌──────────┐ │      │
│  │   │Blog  │   │    │   (static    │     │ │Prose     │ │      │
│  │   │List  │   │    │    content)  │     │ │Content   │ │      │
│  │   └──────┘   │    │              │     │ │  (blog)  │ │      │
│  └──────────────┘    └──────────────┘     │ └──────────┘ │      │
│                                           └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Component Categories

### Layout Components

```
┌─────────────────────────────────────────────────┐
│               TerminalWindow                    │
│  ┌───────────────────────────────────────────┐  │
│  │  [●] [●] [●]   bicepjai@web:{path}        │  │  ← Chrome bar
│  ├───────────────────────────────────────────┤  │
│  │                                           │  │
│  │            {@render children()}           │  │  ← Content slot
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Props: path, matrixEnabled                     │
│  Features: minimize/restore when matrix active  │
└─────────────────────────────────────────────────┘
```

### Content Components

```
┌────────────────────────────────────────────────────┐
│                   ProseContent                     │
│                                                    │
│  Wraps markdown content and enhances images        │
│  with terminal-style presentation                  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │     {@render children()} ──► img elements    │  │
│  │                              are wrapped     │  │
│  │                              with:           │  │
│  │                              - dim toggle    │  │
│  │                              - feh label     │  │
│  │                              - border        │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│                    BlogList                        │
│                                                    │
│  $ ls -la ./blog                                   │
│                                                    │
│  drwxr-xr-x 2024/                                  │
│    -rw-r--r-- post-slug.md           Dec 15       │
│    -rw-r--r-- another-post.md        Nov 02       │
│                                                    │
│  Props: posts[]                                    │
│  Features: Groups by year, terminal ls style      │
└────────────────────────────────────────────────────┘
```

### Image Components

```
MdImage                              ImagePreview
┌────────────────────────┐          ┌────────────────────────┐
│ $ feh image.png [dim]  │          │ $ feh image.png [dim]  │
│ ┌────────────────────┐ │          │ ┌────────────────────┐ │
│ │                    │ │          │ │     (overlay)      │ │
│ │   <img dimmed>     │ │          │ │     <img>          │ │
│ │                    │ │          │ │                    │ │
│ └────────────────────┘ │          │ └────────────────────┘ │
│ > alt text             │          │ > filename - caption   │
└────────────────────────┘          └────────────────────────┘

MdImage: CSS filter dimming          ImagePreview: Overlay dimming
Props: src, alt                      Props: src, alt, caption
```

### Visual Effects

```
┌─────────────────────────────────────────────────────┐
│                    MatrixRain                       │
│                                                     │
│      ア  コ     0  明     ワ                        │
│      イ  サ     1  暗     ヲ                        │
│      ウ  シ     2  光     ン                        │
│      エ  ス     3  闇     日                        │
│      オ  セ     4  電     月                        │
│                                                     │
│  Props: enabled                                     │
│  Features:                                          │
│  - Canvas-based animation                           │
│  - Graceful start/stop transitions                  │
│  - Japanese characters + numbers                    │
│  - White lead char, green fade trail                │
└─────────────────────────────────────────────────────┘
```

### Navigation

```
┌─────────────────────────────────────────────────────────────┐
│                       Navigation                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ~/blog    ~/about              [enter the matrix]  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Props: onMatrixToggle, matrixEnabled                       │
│  Features: Active state highlighting, matrix toggle         │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
                    ┌─────────────────┐
                    │    +layout      │
                    │                 │
                    │ matrixEnabled   │◄──── state: boolean
                    │                 │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       ┌──────────┐   ┌──────────┐   ┌──────────┐
       │Navigation│   │MatrixRain│   │  Pages   │
       │          │   │          │   │          │
       │onToggle()│──►│ enabled  │   │ matrix   │
       │          │   │          │   │ Enabled  │
       └──────────┘   └──────────┘   └────┬─────┘
                                          │
                                          ▼
                                   ┌─────────────┐
                                   │Terminal     │
                                   │Window       │
                                   │             │
                                   │matrixEnabled│
                                   │(minimize)   │
                                   └─────────────┘
```

## Component Summary

| Component      | Type    | Purpose                                   |
| -------------- | ------- | ----------------------------------------- |
| Navigation     | Layout  | Site nav + matrix toggle control          |
| MatrixRain     | Effect  | Animated falling character background     |
| TerminalWindow | Layout  | Terminal-styled container with chrome bar |
| BlogList       | Content | Display posts as terminal ls output       |
| ProseContent   | Content | Markdown wrapper with image enhancement   |
| MdImage        | Content | Single image with dim toggle (filter)     |
| ImagePreview   | Content | Single image with dim toggle (overlay)    |
