def rank_candidates(collab, content, popular):

    scores = {}

    for i in collab:
        scores[i] = scores.get(i, 0) + 0.4

    for i in content:
        scores[i] = scores.get(i, 0) + 0.3

    for i in popular:
        scores[i] = scores.get(i, 0) + 0.3

    return sorted(scores, key=scores.get, reverse=True) 