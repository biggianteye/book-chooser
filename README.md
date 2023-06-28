# book-chooser

![](https://media.giphy.com/media/lSseUdQmlrM8xi8dpJ/giphy.gif)

My "to read" list is long and forever getting longer with each passing day. I also get overwhelmed by choice, so I thought I would get a computer to tell me what to read next[^1]. This project is driven by a Google spreadsheet containing a list of books. It uses tags associated with each book and other metadata to prioritise and choose the next book to read. Tags can be positive, negative or neutral and will all have an influence.

Tags are just strings and have no inherent format, but some examples might be:

| Tag                    | Modifier | Note                                      |
|------------------------|---------:|-------------------------------------------|
| `borrowed-from-friend` |       +5 | very positive - get it back to them ASAP! |
| `award:hugo-winner`    |       +1 | positive                                  |
| `format:e-book`        |        0 | neutral                                   |
| `location:usa`         |       -1 | negative                                  |

The code doesn't know or care about the tag text. That's for humans. All it cares about is the modifier.

[^1]: Also this gives me an excuse to try out a new programming language!

## Spreadsheet structure

### Tab: `Books`

| Column | Name             | Type         |
|--------|------------------|--------------|
| A      | Title            | String       |
| B      | Author           | String       |
| C      | Year published   | Integer      |
| D      | Goodreads link   | String       |
| E      | Goodreads rating | Number (2DP) |
| F      | Date read        | Date         |

### Tab: `Tags`

| Column | Name     | Type    |
|--------|----------|---------|
| A      | Name     | String  |
| B      | Modifier | Integer |

### Tab: `Book Tags`

| Column | Name  | Type   | Note                   |
|--------|-------|--------|------------------------|
| A      | Title | String | References Books.Title |
| B      | Tag   | String | References Tags.Name   |
