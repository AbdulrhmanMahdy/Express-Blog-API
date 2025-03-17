const express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const router = express.Router();

const verifyUser = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const user = await prisma.user.findUnique({
			where: { email: payload.email },
		});

		req.user = user;
		next();
	} catch (err) {
		next(err);
	}
};

router.post("/posts/:postId", verifyUser, async (req, res) => {
	try {
		const { postId } = req.params;
		const { content } = req.body;
		const post = await prisma.post.findUnique({
			where: { id: parseInt(postId) }
		});
		if (!post) {
			return res.status(500).json({ message: "Post not found" });
		}
		const comment = await prisma.comment.create({
			data: {
				content,
				authorId: req.user.id,
				postId: parseInt(postId)
			},
			include: {
				author: {
					select: {
						id: true,
						name: true
					}
				}
			}
		});
		res.status(200).json(comment);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/posts/:postId", async (req, res) => {
	try {
		const { postId } = req.params;
		const post = await prisma.post.findUnique({
			where: { id: parseInt(postId) },
			include: {
				comments: {
					include: {
						author: {
							select: { name: true }
						}
					},
				},
			},
		});
		res.status(200).json(post.comments);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/comments/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const comment = await prisma.comment.findUnique({
			where: {
				id: parseInt(id)
			},
		});
		if (comment === null) {
			return res.status(500).json({ message: "Comment not found" });
		}
		res.status(200).json(comment);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.patch("/comments/:id", verifyUser, async (req, res) => {
	try {
		const { id } = req.params;
		const { content } = req.body;
		const existingComment = await prisma.comment.findUnique({
			where: { id: parseInt(id) }
		});

		if (!existingComment) {
			return res.status(500).json({ message: "Comment not found" });
		}

		if (existingComment.authorId !== req.user.id) {
			return res.status(500).json({ message: "Not authorized to update this comment" });
		}
		const updatedComment = await prisma.comment.update({
			where: { id: parseInt(id) },
			data: { content },
			include: {
				author: {
					select: {
						id: true,
						name: true
					}
				}
			}
		});
		res.status(200).json(updatedComment);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.delete("/comments/:id", verifyUser, async (req, res) => {
	try {
		const { id } = req.params;
		const existingComment = await prisma.comment.findUnique({
			where: { id: parseInt(id) }
		});
		if (!existingComment) {
			return res.status(500).json({ message: "Comment not found" });
		}
		if (existingComment.authorId !== req.user.id) {
			return res.status(500).json({ message: "Not authorized to delete this comment" });
		}
		await prisma.comment.delete({
			where: { id: parseInt(id) }
		});
		res.status(200).json({ message: 'Comment Deleted Success' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;